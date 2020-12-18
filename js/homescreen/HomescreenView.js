(function(views)
{
    var self;
    
    function HomescreenView(presenter)
    {
        self = this;
        this.presenter = presenter;
    }

    Object.defineProperties(HomescreenView.prototype,
    {
        init : {
            value: function()
            {
                
            },
            enumerable: false
        },
        onLogin : {
            value: function()
            {
                self.presenter.get(self.onLoad);
            },
            enumerable: false
        },
		onLoad : {
            value: function(data)
            {
                console.log(data)
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.HomescreenView = HomescreenView;
})(blink.views);