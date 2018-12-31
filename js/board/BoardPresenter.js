(function(presenters)
{
    function BoardPresenter(Context)
    {
        this.interactor = Context.getBoardInteractor();
       
        this.boardView = Context.getBoardView(this);
        this.boardView.init();
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
                        console.log(data);
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