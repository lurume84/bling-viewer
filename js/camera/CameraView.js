(function(views)
{
    var self;
    var card;
    
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
                console.log(data)
                
                this.card = $("<div/>", {class: "demo-card-square mdl-card mdl-shadow--2dp"});
                    
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

                if(data.enabled)
                {
                    description += moment(data.updated_at).fromNow();
                }
                else
                {
                    description += "<span class='error'>Disabled</span>";
                }
                    
                var content = "<div class='description'>" + description + "</div><div class='icons'>" + icons + "</div>";    
                
                var title = $("<div/>", {class: "mdl-card__title mdl-card--expand", html: "<h2 class='mdl-card__title-text'>" + data.name + "</h2>"});
                var text = $("<div/>", {class: "mdl-card__supporting-text", html: content});
                var actions = $("<div/>", {class: "mdl-card__actions mdl-card--border", html: "<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>View Events</a>"});
                
                title.appendTo(this.card);
                text.appendTo(this.card);
                actions.appendTo(this.card);
                
                this.card.appendTo($(".content"));
                
                this.presenter.getThumbnail(data.thumbnail);
            },
            enumerable: false
        },
        onThumbnail : {
            value: function(data)
            {
                var image = this.card.find(".mdl-card__title");
                image.css("background-image", "url('data:image/png;base64," + data + "')");
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