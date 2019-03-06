(function(views)
{
    var self;
    
    function CameraView(presenter)
    {
        this.presenter = presenter;
        self = this;
    }

    Object.defineProperties(CameraView.prototype,
    {
        init : {
            value: function()
            {

            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var card = $("<div/>", {class: "demo-card-square mdl-card mdl-shadow--2dp"});
                    
                var icons = "";

                if(data.ac_power)
                {
                    icons += "<i class='fas fa-plug' title='Plugged'></i>";
                }
                else
                {
                    if(data.battery_state == "ok")
                    {
                        icons += "<i class='fas fa-battery-full' title='" + data.battery_state + " (" + moment(data.battery_check_time).fromNow() + ")'></i>";
                    }
                    else
                    {
                        icons += "<i class='fas fa-battery-quarter' title='" + data.battery_state + " (" + moment(data.battery_check_time).fromNow() + ")'></i>";
                    }
                }
                    
                var description = data.temperature + " ºF - Updated ";

                description += moment(data.updated_at).fromNow();
               
                var content = "<div class='description'>" + description + "</div><div class='icons'>" + icons + "</div>";    
                
                var serial = " (" + data.serial + ")";
                
                var title = $("<div/>", {class: "mdl-card__title mdl-card--expand", html: "<h2 class='mdl-card__title-text'>" + data.name + serial + "</h2>"});
                var text = $("<div/>", {class: "mdl-card__supporting-text", html: content});
                var actions = $("<div/>", {class: "mdl-card__actions mdl-card--border", html: "<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>View Events</a>"});
                
                title.appendTo(card);
                text.appendTo(card);
                actions.appendTo(card);
                
                this.presenter.getThumbnail(data.thumbnail, function(data2)
                {
                    var image = card.find(".mdl-card__title");
                    image.css("background-image", "url('data:image/png;base64," + data2 + "')");
                });
                
                card.appendTo($(".content"));
            },
            enumerable: false
        },
        onNetwork : {
            value: function(data)
            {
                $("#network" + data.network_id).click(function(evt)
                {
                    $(".header > div > span").html($(this).data("name"));
                    $(".content").html("");
                    
                    $.each( data.cameras, function( key, value2 )
                    {
                        self.presenter.getCamera(data.network_id, value2.id, value2.name);
                    });
                    
                    evt.preventDefault();
                });
            },
            enumerable: false
        },
        onCamera : {
            value: function(data)
            {
                self.load(data.camera_status);
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

    views.CameraView = CameraView;
})(blink.views);