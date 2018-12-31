(function(views)
{
    var self;

    function BoardView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(BoardView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).ready(function ()
                {
					
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                //$(".drawer .navigation").append("<a class='mdl-navigation__link' href=''><i class='mdl-color-text--blue-grey-400 material-icons' role='presentation'>home</i>Dashboard</a>");
                //$(".drawer .navigation").append("<div class='mdl-layout-spacer'></div>");
                $.each( data.networks, function( key, value )
                {
                    $(".drawer .navigation").append("<a class='mdl-navigation__link' href=''><i class='mdl-color-text--blue-grey-400 material-icons' role='presentation'>inbox</i>" + value.name + "</a>");
                });
            },
            enumerable: false
        },

        showError : {
            value: function(data)
            {
                console.log(data);
            },
            enumerable: false
        }
    });

    views.BoardView = BoardView;
})(blink.views);