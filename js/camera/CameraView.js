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
                                                    "</a><video controls></video>"                                                    
                                            });
                                            
                actions.find(".thumbnail-button").click(function(){self.requestThumbnail(data);});
                actions.find(".live-view-button").click(function(){self.clickLiveView(data);});
                
                title.appendTo(card);
                text.appendTo(card);
                actions.appendTo(card);
                
                self.updateContent(card, data);
                self.getThumbnail(card, data);
                
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
                    
                var temperature;
                
                if(g_user.temp_units == "c")
                {
                    temperature = round(((5/9) * (data.temperature - 32)) , 1);
                    temperature += "ºC";
                }
                else
                {
                    temperature = data.temperature + "ºF";
                    
                    temperature += "(" + round(((5/9) * (data.temperature - 32)) , 1);
                    temperature += "ºC)";
                }
                    
                var description = temperature + " - Updated ";

                description += moment(data.updated_at).fromNow();
               
                card.find(".description").html(description);
                card.find(".icons").html(icons);
                card.find(".mdl-button").attr("disabled", false);
            },
            enumerable: false
        },
        onNetworks : {
            value: function(data)
            {
                $.each( data.networks, function( key, value )
                {
                    self.onNetwork(value);
                });
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
                    
                    var slider = $("<input/>", {class: "mdl-slider mdl-js-slider", type: "range", id: "camera_slider", min: "320", max: "800", value: "320", step:"50"});
                    slider.appendTo($(".content .cameraContainer"));
                    slider.click(function()
                    {
                        var value = $(this).val();
                        
                        var rest = ((value - 320) / 50) * 16 + 1;
                        
                        var card = $(".demo-card-square");
                        card.css("width", "" + value + "px");
                        card.css("height", "" + (value * 0.884375 - rest) + "px");
                    });
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
                    image.css("background-size", "cover");
                    image.css("background-repeat", "no-repeat");
                    
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
                        self.getThumbnail($("#card" + data.camera_id), data);
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
        clickLiveView : {
            value: function(data)
            {
                var card = $("#card" + data.camera_id);
                
                var button = card.find(".live-view-button");
                
                if(!button.prop('disabled'))
                {
                    if(!button.hasClass("live"))
                    {
                        self.presenter.requestLiveView(data.network_id, data.camera_id);
                    }
                    else
                    {
                        button.attr("disabled", true);
                        self.presenter.requestUnjoin(data.camera_id);
                    }
                }
            },
            enumerable: false
        },
        onRequestLiveView : {
            value: function(data, camera_id)
            {
                var card = $("#card" + camera_id);
                card.find(".live-view-button").attr("disabled", true);
                
                self.presenter.requestJoin(camera_id, data.server, self.onJoin);
            },
            enumerable: false
        },
        onUnjoin : {
            value: function(data, camera_id)
            {
                var card = $("#card" + camera_id);
                card.find(".live-view-button").attr("disabled", true);
                
                var video = card.find("video");
                
                var button = card.find(".live-view-button");
                
                button.attr("disabled", false);
                button.removeClass("live");
                button.find(".action").removeClass("fa-eye-slash").addClass("fa-eye");
                
                video.hide();
                
                video[0].pause();
            },
            enumerable: false
        },
        onJoin : {
            value: function(data)
            {
                if(Hls.isSupported())
                {
                    var card = $("#card" + data.camera_id);
                    
                    var video = card.find("video");
                    
                    var button = card.find(".live-view-button");
                    
                    button.attr("disabled", false);
                    button.addClass("live");
                    button.find(".action").removeClass("fa-eye").addClass("fa-eye-slash");
                    
                    video.show();
                    
                    var hlsConfig = {
                        manifestLoadingTimeOut: 100000
                    };
                    
                    var hls = new Hls(hlsConfig);
                    hls.loadSource(data.url);
                    hls.attachMedia(video[0]);
                    hls.on(Hls.Events.MANIFEST_PARSED,function()
                    {
                      video[0].play();
                    });
                    hls.on(Hls.Events.ERROR, function (event, data)
                    {
                        console.warn('Error event:', data);
                        
                        switch (data.details)
                        {
                            case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                                console.warn("Cannot load " + url + '. Code ' + data.response.code + ' . Text: ' + data.response.text);
                                break;
                            case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                                console.warn('Timeout while loading manifest');
                                break;
                            case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                                console.warn('Error while parsing manifest:' + data.reason);
                                break;
                            case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                                console.warn('Error while loading level playlist');
                                break;
                            case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                                console.warn('Timeout while loading level playlist');
                                break;
                            case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                                console.warn('Error while trying to switch to level ' + data.level);
                                break;
                            case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                                console.warn('Error while loading fragment ' + data.frag.url);
                                break;
                            case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                                console.warn('Timeout while loading fragment ' + data.frag.url);
                                break;
                            case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                                console.warn('Fragment-loop loading error');
                                break;
                            case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                                console.warn('Decrypting error:' + data.reason);
                                break;
                            case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                                console.warn('Parsing error:' + data.reason);
                                break;
                            case Hls.ErrorDetails.KEY_LOAD_ERROR:
                                console.warn('Error while loading key ' + data.frag.decryptdata.uri);
                                break;
                            case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
                                console.warn('Timeout while loading key ' + data.frag.decryptdata.uri);
                                break;
                            case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                                console.warn('Buffer append error');
                                break;
                            case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
                                console.warn('Buffer add codec error for ' + data.mimeType + ':' + data.err.message);
                                break;
                            case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
                                console.warn('Buffer appending error');
                                break;
                            case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                                console.warn('Buffer stalled error');
                                break;
                            default:
                                break;
                        }
                        
                        if (data.fatal)
                        {
                            console.error('Fatal error :' + data.details);
                            
                            switch (data.type)
                            {
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    
                                    break;
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    console.error('A network error occured');
                                    break;
                                default:
                                    console.error('An unrecoverable error occured');
                                    hls.destroy();
                                    break;
                            }
                        }
                    });
                    
                    hls.on(Hls.Events.BUFFER_CREATED, function (event, data)
                    {
                        
                    });
                    hls.on(Hls.Events.BUFFER_APPENDING, function (event, data)
                    {
                        
                    });
                    hls.on(Hls.Events.FPS_DROP, function (event, data)
                    {
                        
                    });
                }
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.CameraView = CameraView;
})(blink.views);