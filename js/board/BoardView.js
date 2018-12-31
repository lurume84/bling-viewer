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

            },
            enumerable: false
        },
        onLogin : {
            value: function(data)
            {
                var self = this;
                
                $(".drawer .navigation").append("<div class='separator'>Networks</div>");
                //$(".drawer .navigation").append("<div class='mdl-layout-spacer'></div>");
                $.each( data.networks, function( key, value )
                {
                    var network = $("<a/>", {class: "mdl-navigation__link", href: "#", "data-name": value.name, "data-id": key, html: "<i class='fas fa-network-wired'></i>" + value.name});
                    
                    network.click(function(evt)
                    {
                        $(".header > div > span").html($(this).data("name"));
                        
                        self.presenter.getNetwork($(this).data("id"));
                        evt.preventDefault();
                    });
                    
                    network.appendTo($(".drawer .navigation"));
                });
            },
            enumerable: false
        },
        onNetwork : {
            value: function(data)
            {
                $(".content").html("");
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