(function(views)
{
    var self;

    function LoginView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(LoginView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).ready(function ()
                {             
                    $("#login")[0].showModal();
                    $("#login form").submit(function(evt)
                    {
                        $("#login .progress").show();
                        $("#login .submit").hide();
                        self.presenter.login($("#login .user").val(), $("#login .password").val());
                        evt.preventDefault();
                    });
                    
                    componentHandler.upgradeAllRegistered();
                    
                    self.presenter.checkToken();
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                $("#login .progress").hide();
                
                g_user = data;
                
                $(".avatar-dropdown > span").html(data.email);
                $("#login")[0].close();
                
                var dashboard = $("<a/>", {id: "dashboard", class: "link selected", href: "#", html: "<i class='fas fa-home'></i>"});
                dashboard.appendTo($(".drawer .navigation"));
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                $("#login .progress").hide();
                $("#login .submit").show();
                
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.LoginView = LoginView;
})(blink.views);