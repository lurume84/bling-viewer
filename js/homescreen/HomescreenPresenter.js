(function(presenters)
{
    function HomescreenPresenter(Context)
    {
        this.interactor = Context.getHomescreenInteractor();
        this.cameraView = Context.getCameraPresenter().cameraView;
	   
        this.view = Context.getHomescreenView(this);
        this.view.init();
    }

    Object.defineProperties(HomescreenPresenter.prototype,
    {
        get : {
            value: function(onSuccess)
            {
                var self = this;
                    
                this.interactor.get(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        onSuccess(data);
						
						self.cameraView.onOwls(data.owls);
                    },
                    function(data)
                    {
                        self.view.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.HomescreenPresenter = HomescreenPresenter;
})(blink.presenters);