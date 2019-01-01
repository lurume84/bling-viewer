(function(presenters)
{
    function ActivityPresenter(Context)
    {
        this.interactor = Context.getActivityInteractor();
       
        this.activityView = Context.getActivityView(this);
        this.activityView.init();
    }

    Object.defineProperties(ActivityPresenter.prototype,
    {
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