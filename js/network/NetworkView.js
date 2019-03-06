(function(views)
{
    var self;

    function NetworkView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(NetworkView.prototype,
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
                this.presenter.getNetworks();
            },
            enumerable: false
        },
        onNetworks : {
            value: function(data)
            {
                var self = this;
                
                $(".drawer .navigation").append("<div class='separator'>Networks</div>");
                $.each( data.networks, function( key, value )
                {
                    var network = $("<a/>", {class: "mdl-navigation__link", 
                                            id: "network" + value.network_id,
                                            href: "#", "data-name": value.name, 
                                            "data-id": value.network_id, 
                                            html: "<i class='fas fa-network-wired'></i>" + value.name});
                                            
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
                if(data.status == "401")
                {
                    $("#login")[0].showModal();
                    $(".drawer .navigation").html("");
                }
            },
            enumerable: false
        }
    });

    views.NetworkView = NetworkView;
})(blink.views);