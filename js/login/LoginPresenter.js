(function(presenters)
{
    function LoginPresenter(Context)
    {
        this.interactor = Context.getLoginInteractor();
       
        this.loginView = Context.getLoginView(this);
        this.loginView.init();

        this.homescreenView = Context.getHomescreenPresenter().view;
        this.networkView = Context.getNetworkPresenter().networkView;
        this.activityView = Context.getActivityPresenter().activityView;
    }

    Object.defineProperties(LoginPresenter.prototype,
    {
        login : {
            value: function(user, password)
            {
                var self = this;
                 
				var uid = "00000000-1111-0000-1111-00000000000";
				var notification_key = generate_uid(152);
				 
                this.interactor.login(user, password, uid, notification_key, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
						data.server = "rest-" + data.account.tier + "." + server;
						data.port = 443;
						data.user = user;
						data.uid = uid;
						data.notification_key = notification_key;
						
                        credentials.region = data.account.tier;
                        credentials.token = data.auth.token;
                        credentials.account = data.account;
                        credentials.client = {id: data.account.client_id, verification_required: data.account.client_verification_required};
                        
                        //correction for desktop
                        credentials.account.id = data.account.account_id;
                        credentials.authtoken = {authtoken: credentials.token};
                        data.account.id = data.account.account_id;
                        data.authtoken = {authtoken: credentials.token};

                        self.interactor.setToken(data, new blink.listeners.BaseDecisionListener(function(data){}, function(data){}));
                        
						if(credentials.client.verification_required)
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
                        credentials.region = data.account.tier;
                        credentials.token = data.auth.token;
                        credentials.account = data.account;
                        credentials.client = {id: data.account.client_id, verification_required: data.account.client_verification_required};

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
                        self.homescreenView.onLogin(data);
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
