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
        getList : {
            value: function(startAt = 0)
            {
                var self = this;
                    
                this.interactor.getList(startAt, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        self.boardView.load(data);
						
						if(!data.isLast)
                        {
                            self.getList(data.values.length);
                        }
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