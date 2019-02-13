(function(presenters)
{
    var ctx;
    
    function NetworkPresenter(Context)
    {
        this.interactor = Context.getNetworkInteractor();
       
        this.networkView = Context.getNetworkView(this);
        this.networkView.init();
        
        this.ctx = Context;
    }

    Object.defineProperties(NetworkPresenter.prototype,
    {
        getNetworks : {
            value: function()
            {
                var self = this;
                    
                this.interactor.getNetworks(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.networkView.onNetworks(data);
                    },
                    function(data)
                    {
                        self.networkView.showError(data);
                    }));
            },
            enumerable: false
        },
        getNetwork : {
            value: function(networkId)
            {
                var self = this;
                    
                this.interactor.getNetwork(networkId, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.networkView.onNetwork(data);
                        
                        $.each( data.devicestatus, function( key, value )
                        {
                            self.ctx.getCameraPresenter().cameraView.load(value);
                        });
                    },
                    function(data)
                    {
                        self.networkView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.NetworkPresenter = NetworkPresenter;
})(blink.presenters);