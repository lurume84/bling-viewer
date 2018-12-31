(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();

        this.boardView = Context.getBoardView(this);
    }

    Object.defineProperties(LoginPresenter.prototype,
    {
        login : {
            value: function(user, password)
            {
                var self = this;
                    
                this.interactor.login(user, password, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        credentials.region = data.region.prde;
                        credentials.token = data.authtoken.authtoken;

                        self.loginView.load(data);
                        self.boardView.load(data);
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