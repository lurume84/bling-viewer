(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();

        this.boardView = Context.getBoardPresenter().boardView;
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
                        $.each( data.region, function( key, value )
                        {
                            credentials.region = key;
                        });
                        
                        credentials.token = data.authtoken.authtoken;

                        self.loginView.load(data);
                        self.boardView.onLogin(data);
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