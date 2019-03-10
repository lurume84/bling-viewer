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
        getCamera : {
            value: function(networkId, cameraId, cameraName, onSuccess)
            {
                var self = this;
                    
                this.interactor.getCamera(networkId, cameraId, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        data.camera_status.name = cameraName;
                        onSuccess(data.camera_status);
                    },
                    function(data)
                    {
                        self.cameraView.showError(data);
                    }));
            },
            enumerable: false
        },
        getThumbnail : {
            value: function(path, onSuccess)
            {
                var self = this;
                    
                this.interactor.getThumbnail(path, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        onSuccess(data);
                    },
                    function(data)
                    {
                        self.cameraView.showError(data);
                    }));
            },
            enumerable: false
        },
        requestThumbnail : {
            value: function(network, camera)
            {
                var self = this;
                    
                this.interactor.requestThumbnail(network, camera, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.cameraView.onRequestThumbnail(data);
                    },
                    function(data)
                    {
                        self.cameraView.showError(data);
                    }));
            },
            enumerable: false
        },
        checkCommand : {
            value: function(network, command, onSuccess)
            {
                var self = this;
                    
                this.interactor.checkCommand(network, command, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        onSuccess(data);
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