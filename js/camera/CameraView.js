(function(views)
{
    function CameraView(presenter)
    {
        self = this;
        this.presenter = presenter;
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
                self.card = $("<div/>", {class: "demo-card-square mdl-card mdl-shadow--2dp"});
                    
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
                var actions = $("<div/>", {class: "mdl-card__actions mdl-card--border", 
                                            html: "<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>" +
                                                    "<i class='action fas fa-camera' title='Get thumbnail'></i>" + 
                                                    "</a>",
                                            click: function(){self.requestThumbnail(data);}
                                            });
                
                title.appendTo(self.card);
                text.appendTo(self.card);
                actions.appendTo(self.card);
                
                self.getThumbnail(self.card, data);
                
                self.card.appendTo($(".content"));
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
                        self.presenter.getCamera(data.network_id, value2.id, value2.name, self.load);
                    });
                    
                    evt.preventDefault();
                });
            },
            enumerable: false
        },
        getThumbnail : {
            value: function(card, data)
            {
                self.presenter.getThumbnail(data.thumbnail, function(data2)
                {
                    var image = card.find(".mdl-card__title");
                    image.css("background-image", "url('data:image/png;base64," + data2 + "')");
                });
            },
            enumerable: false
        },
        requestThumbnail : {
            value: function(data)
            {
                self.card
                
                var image = self.card.find(".mdl-card__title");
                image.css("background-image", "none");
                
                //image.html("<div class='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'></div>");
                //componentHandler.upgradeDom();
                console.log(data)
                self.presenter.requestThumbnail(data.network_id, data.camera_id);
            },
            enumerable: false
        },
        onRequestThumbnail : {
            value: function(data)
            {
                setTimeout(function()
                {
                    self.presenter.checkCommand(data.network_id, data.id, self.onThumbnailCommand);
                }, 2000);
            },
            enumerable: false
        },
        onThumbnailCommand : {
            value: function(data)
            {
                if(data.complete)
                {
                    self.presenter.getCamera(data.commands[0].network_id, data.commands[0].camera_id, "", function(data)
                    {
                        self.getThumbnail(self.card, data);
                    });
                }
                else
                {
                    setTimeout(function()
                    {
                        self.presenter.checkCommand(data.commands[0].network_id, data.commands[0].id, self.onThumbnailCommand);
                    }, 2000);
                }
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