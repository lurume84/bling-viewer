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
                 
				var uid = generate_uid(16);
				var notification_key = generate_uid(152);
				 
                this.interactor.login(user, password, uid, notification_key, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
						data.user = user;
						data.uid = uid;
						data.notification_key = notification_key;
						
                        credentials.region = data.region.tier;
                        credentials.token = data.authtoken.authtoken;
                        credentials.account = data.account;
                        credentials.client = data.client;

                        self.interactor.setToken(data, new blink.listeners.BaseDecisionListener(function(data){}, function(data){}));
                        
						if(data.client.verification_required)
						{
							self.loginView.onVerificationRequired(data);
						}
						else
						{
							self.getUser();
						} 
                    },
                    function(data)
                    {
                        self.loginView.showError(data);
                    }));
            },
            enumerable: false
        },
		verify : {
            value: function(key)
            {
                var self = this;
                 
                this.interactor.verify(key, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
						if(data.valid)
						{
							self.getUser();
						}
						else
						{
							document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: "Invalid pin", timeout: 10000});
						}
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
                        credentials.region = data.region.tier;
                        credentials.token = data.authtoken.authtoken;
                        credentials.account = data.account;
                        credentials.client = data.client;

                        self.getUser();
                    },
                    function(data)
                    {
                        
                    }));
            },
            enumerable: false
        },
		checkVersion : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getVersion(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.loginView.versionFound(data);
                    },
                    function(data)
                    {
                        self.loginView.versionNotFound(data);
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
