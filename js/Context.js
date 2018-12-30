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
        getBoardPresenter : {
            value: function()
            {
                return new blink.presenters.BoardPresenter(this);
            },
            enumerable: false
        },
        getBoardView : {
            value: function(presenter)
            {
                return new blink.views.BoardView(presenter);
            },
            enumerable: false
        },
        getBoardInteractor : {
            value: function()
            {
                return new blink.interactors.BoardInteractor();
            },
            enumerable: false
        }
    });

    helpers.Context = Context;
})(blink.helpers);

(function(helpers)
{
    var list =  {
                    board : "getBoardPresenter"
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