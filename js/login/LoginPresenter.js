(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();

        this.networkView = Context.getNetworkPresenter().networkView;
        this.activityView = Context.getActivityPresenter().activityView;
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
                        
                        credentials.account = data.account;

                        self.interactor.setToken(data);
                        self.getUser();
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        },
        checkToken : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getToken(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        $.each( data.region, function( key, value )
                        {
                            credentials.region = key;
                        });
                        
                        credentials.token = data.authtoken.authtoken;
                        
                        credentials.account = data.account;

                        self.getUser();
                    },
                    function(data)
                    {
                        
                    }));
            },
            enumerable: false
        },
        getUser : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getUser(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.loginView.load(data);
                        self.activityView.onLogin(data);
                        self.networkView.onLogin(data);
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        },
    });

    presenters.LoginPresenter = LoginPresenter;
})(blink.presenters);