(function(views)
{
    var self;
    var timeline;

    function ActivityView(presenter)
    {
        self = this;
        this.presenter = presenter;
    }

    Object.defineProperties(ActivityView.prototype,
    {
        init : {
            value: function()
            {

            },
            enumerable: false
        },
        onLogin : {
            value: function()
            {
                var activity = $("<a/>", {class: "mdl-navigation__link", href: "#", html: "<i class='fas fa-running'></i>Activity"});
                
                activity.click(function(evt)
                {
                    self.presenter.getCameras();
                    evt.preventDefault();
                });
                
                activity.appendTo($(".drawer .navigation"));
            },
            enumerable: false
        },
        onCameras : {
            value: function(data)
            {
                this.initTable(data);
            },
            enumerable: false
        },
        initTable : {
            value: function(cameras)
            {
                $(".header > div > span").html("Activity");
                $(".content").html("<div class='videoContainer'></div>"+
                                    "<div class='tableContainer'><table class='activity' class='display' width='100%'></table></div>");
                
                this.cameras = cameras;
                
                var i = 1;
                
                self.loadVideos(i, function()
                {
                    $('.content table.activity tr:first-child').trigger( 'click');
                });
                
                $(".tableContainer").scroll(function()
                {
                    if(Math.round($(this)[0].scrollHeight - $(this).scrollTop()) === Math.round($(this).outerHeight()))
                    {
                        i++;
                        self.loadVideos(i, function(){});
                    }
                });
            },
            enumerable: false
        },
        
        loadVideos : {
            value: function(page, loaded)
            {
                self.presenter.getVideos(page, function(data, count)
                {
                    var events = [];
                    
                    if(data.videos != undefined)
                    {
                        var table = $("table.activity");
                        
                        $("<tr/>", {html: "<td></td><td></td><td></td>", class: "separator"}).appendTo(table);
                        
                        $.each( data.videos, function( key, value )
                        {
                            if(!value.deleted)
                            {
                                var icon = "";
                                
                                for(var i = 0; i < self.cameras.length; ++i)
                                {
                                    if(self.cameras[i].name == value.camera_name)
                                    {
                                        icon = "<img class='icon' src=\"img/" + self.cameras[i].type + ".png\"/>";
                                        break;
                                    }
                                }
                                var cameraName = icon + value.camera_name;
                                
                                var tr = $("<tr/>");
                                tr.appendTo(table);
                                
                                var thumbnail = $("<td/>", {html: '<div class="thumbnail" id="thumbnail' + tr.index() + '"><div class="loadingContainer"><div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div></div></div>'});
                                var cameraName = $("<td/>", {html: icon + value.camera_name});
                                var time = $("<td/>", {html: moment(value.created_at).fromNow()});
                                var duration = $("<td/>", {html: moment.utc(value.length * 1000).format('HH:mm:ss')});
                                var video = $("<td/>", {html: '<div class="actions"><i class="download fas fa-download" data-path="' + value.address + '"></i></div>'});
                                
                                thumbnail.appendTo(tr);
                                //cameraName.appendTo(tr);
                                time.appendTo(tr);
                                //duration.appendTo(tr);
                                video.appendTo(tr);
                                
                                video.find(".download").click(function(evt)
                                {
                                    var path = $(this).data("path");
                                    self.presenter.downloadMedia(path, function(data)
                                    {
                                        var a = document.createElement('a');
                                        var url = window.URL.createObjectURL(data);
                                        a.href = url;
                                        a.download = path.replace(/^.*[\\\/]/, '');
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                    });
                                    
                                    evt.preventDefault();
                                });
                                
                                self.presenter.getMedia(value.thumbnail + "_s.jpg", function(content)
                                {
                                    var container = $("#thumbnail" + tr.index());
                                    
                                    container.html("");
                                    
                                    var thumbnail = $("<div/>", {class: "videoThumbnail"});
                                    thumbnail.css("background-image", "url('data:image/png;base64," + content + "')");
                                    
                                    thumbnail.appendTo(container);
                                });
                                
                                tr.on( 'click', function ()
                                {
                                    var table = $(this).parent();
                                    
                                    table.find('tr.selected').removeClass('selected');
                                    $(this).addClass('selected');
                                    
                                    $(".videoContainer").html("<div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>");
                                    
                                    componentHandler.upgradeAllRegistered();
                                    
                                    var path = $(this).find(".actions i").data("path");
                                    
                                    self.presenter.getMedia(path, function(content)
                                    {
                                        $(".videoContainer").html("<video controls autoplay><source type='video/mp4' src='data:video/mp4;base64," + content + "'></video>");
                                    });
                                });
                            }
                        });
                        
                        componentHandler.upgradeAllRegistered();
                        
                        loaded();
                    }
                });
            },
            enumerable: false
        },
        renderThumbnail : {
            value: function(data, type, row, meta)
            {
                self.presenter.getMedia(data, function(content)
                {
                    var container = $("#thumbnail" + meta.row);
                    
                    container.html("");
                    
                    var thumbnail = $("<div/>", {class: "videoThumbnail"});
                    thumbnail.css("background-image", "url('data:image/png;base64," + content + "')");
                    
                    thumbnail.appendTo(container);
                });
                
                return '<div class="thumbnail" id="thumbnail' + meta.row + '"><div class="loadingContainer"><div class="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"></div></div></div>';
            },
            enumerable: false
        },
        renderActions : {
            value: function(data, type, row, meta)
            {
                return '<div class="actions"><i class="download fas fa-download" data-path="' + data + '"></i></div>';
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                console.error(data);
            },
            enumerable: false
        }
    });

    views.ActivityView = ActivityView;
})(blink.views);