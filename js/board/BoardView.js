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
                var self = this;
                
                //$(".drawer .navigation").append("<a class='mdl-navigation__link' href=''><i class='mdl-color-text--blue-grey-400 material-icons' role='presentation'>home</i>Dashboard</a>");
                //$(".drawer .navigation").append("<div class='mdl-layout-spacer'></div>");
                $.each( data.networks, function( key, value )
                {
                    var network = $("<a/>", {class: "mdl-navigation__link", href: "#", "data-id": key, html: "<i class='mdl-color-text--blue-grey-400 material-icons' role='presentation'>inbox</i>" + value.name});
                    
                    network.click(function(evt)
                    {
                        self.presenter.getNetwork($(this).data("id"));
                        evt.preventDefault();
                    });
                    
                    network.appendTo($(".drawer .navigation"));
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