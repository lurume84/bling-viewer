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
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                console.log(data);
                $("#login .progress").hide();
                $(".avatar-dropdown > span").html($("#login .user").val());
                $("#login")[0].close();
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                $("#login .progress").hide();
                $("#login .submit").show();
                console.log(data);
            },
            enumerable: false
        }
    });

    views.LoginView = LoginView;
})(blink.views);