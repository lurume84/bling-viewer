#!/usr/local/bin/perl -w

use utf8;
use Mojolicious::Lite;
use Mojo::Log;
use LWP::UserAgent;
use HTTP::Request;
my $log = Mojo::Log->new(path => 'proxy.log', level => 'info');

my $proxy_host = "localhost";
my $proxy_port = 3000;

app->config(hypnotoad => {listen => ["http://*:" . $proxy_port]});

my $app = app;
my $static = $app->static;
push @{$static->paths}, ($ENV{PWD});

get '/robots.txt' => \&robots;
get '/' => sub { my $c = shift; $c->reply->static('index.html'); };
any ['OPTIONS', 'GET', 'POST'] => '/http*' => \&handle_page;

app->secrets(['kill the referrer']);
app->start;

sub robots {
    my $no = <<END_ROBOTS;
User-agent: *
Disallow: /
END_ROBOTS
    $_[0]->render(data => $no, format => 'txt');
}

sub handle_page {
    my $c = shift;
    my $url = $c->req->url // "";
    $log->info(sprintf("url=%s", $url));
    relay_data_with_headers($c);
}

sub relay_data_with_headers {
    my $c = shift;
    my $proxy_host = shift // "localhost";

    my $page = $c->req->url // "";
    $log->info(sprintf("page=%s", $page));


    my $ua = LWP::UserAgent->new;
    $ua->env_proxy;
    my $timeout = 4;
    while (1) { # "infine" loop for retries (normal exit via "return")

        my $remote_url = substr($page,1); # strip leading /
        my ($remote_hostport) = $remote_url =~ m{://([^/]+)};
        my ($remote_host, $remote_port) = split(":", $remote_hostport, 2);
        $remote_port //= $remote_url =~ m{^https:} ? 443 : 80;

        my $method = $c->req->method;
        if ($method eq "OPTIONS") {
            for my $h (@{$c->req->headers->names}) {
                my $v = $c->req->headers->header($h);
                $log->info(sprintf("incoming OPTIONS header: %s => %s", $h, $v));
            }

            $c->res->code(204);
            $c->res->message("No Content");
            #$c->res->content->body
            $c->res->headers->from_hash({});
            $c->res->headers->header("Access-Control-Allow-Origin" => "*");
            $c->res->headers->header("Access-Control-Allow-Methods" => "*");
            $c->res->headers->header("Access-Control-Allow-Headers" => "*");
            $c->res->headers->header("Access-Control-Max-Age" => "86400");
            $c->render(data => "");
            $log->info(sprintf("Faked OPTIONS response"));  # or whatever
            return;
        }

        my $wait = $method eq "POST" ? 60 : $timeout;
        $ua->timeout($wait);
        $log->info(sprintf("remote req method+url => %s %s (timeout=%d)", $method, $remote_url, $wait));
        my $req = HTTP::Request->new($method, $remote_url);
        if (defined $c->req->body) {
            my $body = $c->req->body;
            $log->info(sprintf("relaying %s bytes of body", length($body)));
            $req->content($body);
        }

        # copy request headers over, modify host to match remote:
        $req->headers->clear;
        for my $h (@{$c->req->headers->names}) {
            my $v = $c->req->headers->header($h);
            next if lc($h) =~ m{^user-agent$}; # strip referrer
            next if lc($h) =~ m{^referr?er$}; # strip referrer
            next if lc($h) =~ m{^sec-};  # strip access-control headers
            $v = "$remote_host:$remote_port" if lc($h) eq "host";
            $log->info(sprintf("relaying request header %s: %s", $h, $v));
            $req->header($h => $v);
        }

        my $res = $ua->simple_request($req);

        $log->info(sprintf("remote_host response: %s %s", $res->code, $res->message));
        if (!$res->is_error) {
            # copy response headers back, modify host to match local:
            $c->res->headers->from_hash({});
            for my $h ($res->headers->header_field_names) {
                my $v = $res->header($h);
                $v = "http://$proxy_host:$proxy_port/$v" if $v =~ m{^https?://};

                next if lc($h) =~ m{^access-control-};  # strip access-control headers
                next if lc($h) =~ m{^sec-};  # strip access-control headers
                $log->info(sprintf("relaying response header %s: %s", $h, $v));
                $c->res->headers->header($h => $v);
            }
            $c->res->headers->header("Access-Control-Allow-Origin" => "*");
            $c->res->headers->header("Access-Control-Allow-Methods" => "*");
            $c->res->headers->header("Access-Control-Allow-Headers" => "*");
            $c->res->headers->header("Access-Control-Max-Age" => "86400");

            my $data = $res->content;
            my $content_type = $res->header("Content-Type");
            $c->res->code($res->code);
            $c->res->message($res->message);
            #$c->res->content->body
            $c->render(data => $data);
            $log->info(sprintf("relay_len => %d", length($data)));  # or whatever

        }
        else {
            $log->info(sprintf("lwp error => %s", $res->status_line));
            if ($res->status_line =~ m{timeout}) {
                $timeout += 4;
                last if $timeout > 35;
                redo;
            }
            return $c->reply->not_found;
        }
        last;
    }
    return;
}

__DATA__

@@ not_found.html.ep
An error occurred

