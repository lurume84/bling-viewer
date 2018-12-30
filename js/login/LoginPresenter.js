(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();
    }

    Object.defineProperties(LoginPresenter.prototype,
    {
        login : {
            value: function(startAt = 0)
            {
                var self = this;
                    
                this.interactor.login(startAt, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        credentials.region = data.region.psobject.properties.name;
                        credentials.token = data.authtoken.authtoken;

                        self.loginView.load(data);
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.LoginPresenter = LoginPresenter;
})(blink.presenters);