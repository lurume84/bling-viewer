(function(presenters)
{
    function CameraPresenter(Context)
    {
        this.interactor = Context.getCameraInteractor();
       
        this.cameraView = Context.getCameraView(this);
        this.cameraView.init();
    }

    Object.defineProperties(CameraPresenter.prototype,
    {
        getThumbnail : {
            value: function(path)
            {
                var self = this;
                    
                this.interactor.getThumbnail(path, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.cameraView.onThumbnail(data);
                    },
                    function(data)
                    {
                        self.cameraView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.CameraPresenter = CameraPresenter;
})(blink.presenters);