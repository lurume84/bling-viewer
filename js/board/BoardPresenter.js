(function(presenters)
{
    var ctx;
    
    function BoardPresenter(Context)
    {
        this.interactor = Context.getBoardInteractor();
       
        this.boardView = Context.getBoardView(this);
        this.boardView.init();
        
        this.ctx = Context;
    }

    Object.defineProperties(BoardPresenter.prototype,
    {
        getNetwork : {
            value: function(networkId)
            {
                var self = this;
                    
                this.interactor.getNetwork(networkId, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.boardView.onNetwork(data);
                        
                        $.each( data.devicestatus, function( key, value )
                        {
                            self.ctx.getCameraPresenter().cameraView.load(value);
                        });
                    },
                    function(data)
                    {
                        self.boardView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.BoardPresenter = BoardPresenter;
})(blink.presenters);