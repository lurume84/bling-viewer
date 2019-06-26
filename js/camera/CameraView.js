(function(views)
{
    var self;
    
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
                var card = $("<div/>", {id: "card" + data.camera_id, class: "demo-card-square mdl-card mdl-shadow--2dp"});
                    
                var serial = " (" + data.serial + ")";
                
                var loading = "<div class='mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active'></div>";
                
                var title = $("<div/>", {class: "mdl-card__title mdl-card--expand", html: loading + "<h2 class='mdl-card__title-text'>" + data.name + serial + "</h2>"});
                var text = $("<div/>", {class: "mdl-card__supporting-text", html: "<div class='description'></div><div class='icons'></div>"});
                var actions = $("<div/>", {class: "mdl-card__actions mdl-card--border", 
                                            html: "<a class='thumbnail-button mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>" +
                                                    "<i class='action fas fa-camera' title='Get thumbnail'></i>" + 
                                                    "</a>" +
                                                    "<a class='live-view-button mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>" +
                                                    "<i class='action fas fa-eye' title='Live view'></i>" + 
                                                    "</a>"                                                    
                                            });
                                            
                actions.find(".thumbnail-button").click(function(){self.requestThumbnail(data);});
                actions.find(".live-view-button").click(function(){self.requestLiveView(data);});
                
                
                title.appendTo(card);
                text.appendTo(card);
                actions.appendTo(card);
                
                self.updateContent(card, data);
                
                card.appendTo($(".content .cameraContainer"));
                
                
                componentHandler.upgradeDom();
            },
            enumerable: false
        },
        updateContent : {
            value: function(card, data)
            {
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
               
                card.find(".description").html(description);
                card.find(".icons").html(icons);
                card.find(".mdl-button").attr("disabled", false);
                
                self.getThumbnail(card, data);
            },
            enumerable: false
        },
        onNetwork : {
            value: function(data)
            {
                $("#network" + data.network_id).click(function(evt)
                {
                    $(".header > div > span").html($(this).data("name"));
                    $(".content").html("<div class='cameraContainer mdl-grid'></a>");
                    
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
                self.presenter.getThumbnail(data.thumbnail, function(thumbnail)
                {
                    var image = card.find(".mdl-card__title");
                    image.css("background-image", "url('data:image/png;base64," + thumbnail + "')");
                    image.find(".mdl-spinner").hide();
                });
            },
            enumerable: false
        },
        requestThumbnail : {
            value: function(data)
            {
                var card = $("#card" + data.camera_id);
                
                var image = card.find(".mdl-card__title");
                image.css("background-image", "none");
                
                image.find(".mdl-spinner").show();
                
                card.find(".description").html("");
                card.find(".icons").html("");
                card.find(".mdl-button").attr("disabled", true);
                
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
                        self.updateContent($("#card" + data.camera_id), data);
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
        requestLiveView : {
            value: function(data)
            {
                self.presenter.requestLiveView(data.network_id, data.camera_id);
            },
            enumerable: false
        },
        onRequestLiveView : {
            value: function(data)
            {
                console.log(data.server);
                
                setTimeout(function()
                {
                    self.presenter.checkCommand(data.network_id, data.id, self.onLiveViewCommand);
                }, 2000);
            },
            enumerable: false
        },
        onLiveViewCommand : {
            value: function(data)
            {
                var url = data.commands[0].server
                
                //console.log(url)
                
                //self.presenter.joinCommand(data.commands[0].network_id, data.commands[0].camera_id, data.commands[0].id, self.onJoinCommand);
                
                //$(".content .cameraContainer").append("<video src='" + url + "' autoplay style=\"width:400px;height:300px\"></video>");
                
                if(data.complete)
                {
                    
                }
                else
                {
                    setTimeout(function()
                    {
                        self.presenter.checkCommand(data.commands[0].network_id, data.commands[0].id, self.onLiveViewCommand);
                    }, 2000);
                }
            },
            enumerable: false
        },
        onJoinCommand : {
            value: function(data)
            {
                console.log(data)
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