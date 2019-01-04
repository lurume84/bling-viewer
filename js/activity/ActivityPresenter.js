(function(presenters)
{
    function ActivityPresenter(Context)
    {
        this.interactor = Context.getActivityInteractor();
        this.networkInteractor = Context.getNetworkInteractor();
       
        this.activityView = Context.getActivityView(this);
        this.activityView.init();
    }

    Object.defineProperties(ActivityPresenter.prototype,
    {
        getCameras : {
            value: function()
            {
                var self = this;
                
                var cameras = [];
                
                this.networkInteractor.getNetworks(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        var numNetworks = data.networks.length;
                        var i = 0;
                        
                        $.each( data.networks, function( key, value )
                        {
                            self.networkInteractor.getNetwork(value.id, new blink.listeners.BaseDecisionListener(
                            function(data)
                            {
                                i++;
                                
                                $.each( data.devicestatus, function( key, value )
                                {
                                    cameras.push(value);
                                });
                                
                                if(i >= numNetworks)
                                {
                                    self.activityView.onCameras(cameras);
                                }
                            },
                            function(data)
                            {
                                self.activityView.showError(data);
                            })); 
                        });
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        },
        getVideos : {
            value: function(i = 0)
            {
                var self = this;
                
                this.interactor.getVideos(i, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        if(data.length > 0)
                        {
                            self.activityView.load(data);
                            self.getVideos(i + 1);
                        }
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.ActivityPresenter = ActivityPresenter;
})(blink.presenters);