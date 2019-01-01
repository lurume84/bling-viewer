var blink = blink || {};
blink.helpers = blink.helpers || {};
blink.presenters = blink.presenters || {};
blink.views = blink.views || {};
blink.models = blink.models || {};
blink.interactors = blink.interactors || {};
blink.listeners = blink.listeners || {};

(function(helpers)
{
    function Context()
    {
        
    }

    Object.defineProperties(Context.prototype,
    {
        getNetworkPresenter : {
            value: function()
            {
                return new blink.presenters.NetworkPresenter(this);
            },
            enumerable: false
        },
        getNetworkView : {
            value: function(presenter)
            {
                return new blink.views.NetworkView(presenter);
            },
            enumerable: false
        },
        getNetworkInteractor : {
            value: function()
            {
                return new blink.interactors.NetworkInteractor();
            },
            enumerable: false
        },
        getLoginPresenter : {
            value: function()
            {
                return new blink.presenters.LoginPresenter(this);
            },
            enumerable: false
        },
        getLoginView : {
            value: function(presenter)
            {
                return new blink.views.LoginView(presenter);
            },
            enumerable: false
        },
        getLoginInteractor : {
            value: function()
            {
                return new blink.interactors.LoginInteractor();
            },
            enumerable: false
        },
        getCameraPresenter : {
            value: function()
            {
                return new blink.presenters.CameraPresenter(this);
            },
            enumerable: false
        },
        getCameraView : {
            value: function(presenter)
            {
                return new blink.views.CameraView(presenter);
            },
            enumerable: false
        },
        getCameraInteractor : {
            value: function()
            {
                return new blink.interactors.CameraInteractor();
            },
            enumerable: false
        },
        getActivityPresenter : {
            value: function()
            {
                return new blink.presenters.ActivityPresenter(this);
            },
            enumerable: false
        },
        getActivityView : {
            value: function(presenter)
            {
                return new blink.views.ActivityView(presenter);
            },
            enumerable: false
        },
        getActivityInteractor : {
            value: function()
            {
                return new blink.interactors.ActivityInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(blink.helpers);

(function(helpers)
{
    var list =  {
                    login : "getLoginPresenter"
                };

    function Initializer()
    {
        var initList = initializeConfig || {};

        var context = new helpers.Context();
        for(var k in initList)
        {
            if(list.hasOwnProperty(initList[k]))
            {
                context[list[initList[k]]]();
            }
        }
    }

    helpers.Initializer = Initializer;
})(blink.helpers);