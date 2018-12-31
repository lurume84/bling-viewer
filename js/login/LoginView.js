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
                        self.presenter.login($("#login .user").val(), $("#login .password").val());
                        evt.preventDefault();
                    });
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                console.log(data);
                $(".avatar-dropdown > span").html($("#login .user").val());
                $("#login")[0].close();
            },
            enumerable: false
        },

        showError : {
            value: function(data)
            {
                console.log(data);
            },
            enumerable: false
        }
    });

    views.LoginView = LoginView;
})(blink.views);