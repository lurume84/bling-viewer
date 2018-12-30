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
                    self.presenter.login();
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                console.log(data);
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