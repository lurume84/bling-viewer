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
                $(".content").html("<div class='tableContainer'><table class='activity' class='display' width='100%'></table></div>"+
                                    "<div class='videoContainer'></div>");
                
                this.cameras = cameras;
                
                // Register an API method that will empty the pipelined data, forcing an Ajax
                // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
                $.fn.dataTable.Api.register( 'clearPipeline()', function () {
                    return this.iterator( 'table', function ( settings ) {
                        settings.clearCache = true;
                    } );
                } );

                var table = $('.content table.activity').dataTable(
                {
                    columns:
                    [
                        {title: "", render: self.renderThumbnail},
                        {title: "Camera"},
                        {title: "Time"},
                        {title: "Duration"},
                        {title: "", render: self.renderActions, width: "20px"}
                    ],
                    processing: true,
                    serverSide: true,
                    ordering: false,
                    searching: false,
                    bLengthChange: false,
                    ajax: self.pipelineTable({pages: 1})
                }).on('draw.dt', function ()
                {
                    componentHandler.upgradeAllRegistered();
                    
                    $(".download").click(function()
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
                    });
                    
                    $('.content table.activity tr:first-child').trigger( 'click');
                });
                
                $('.content table.activity').on( 'click', 'tr', function ()
                {
                    table.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    
                    $(".videoContainer").html("<div class=\"mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active\"></div>");
                    
                    componentHandler.upgradeAllRegistered();
                    
                    var path = table.$('tr.selected').find(".actions i").data("path");
                    
                    self.presenter.getMedia(path, function(content)
                    {
                        $(".videoContainer").html("<video controls autoplay><source type='video/mp4' src='data:video/mp4;base64," + content + "'></video>");
                    });
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
        pipelineTable : {
            value: function(opts)
            {
                var self = this;
                
                var conf = $.extend( {
                    pages: 1,     // number of pages to cache
                    url: '',      // script url
                    data: null,   // function or object with parameters to send to the server
                                  // matching how `ajax.data` works in DataTables
                    method: 'GET' // Ajax HTTP method
                }, opts );
             
                // Private variables for storing the cache
                var cacheLower = -1;
                var cacheUpper = null;
                var cacheLastRequest = null;
                var cacheLastJson = null;
             
                return function ( request, drawCallback, settings )
                {
                    var ajax          = false;
                    var requestStart  = request.start;
                    var drawStart     = request.start;
                    var requestLength = request.length;
                    var requestEnd    = requestStart + requestLength;
                     
                    if ( settings.clearCache ) {
                        // API requested that the cache be cleared
                        ajax = true;
                        settings.clearCache = false;
                    }
                    else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
                        // outside cached data - need to make a request
                        ajax = true;
                    }
                    else if ( JSON.stringify( request.order )   !== JSON.stringify( cacheLastRequest.order ) ||
                              JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
                              JSON.stringify( request.search )  !== JSON.stringify( cacheLastRequest.search )
                    ) {
                        // properties changed (ordering, columns, searching)
                        ajax = true;
                    }
                     
                    // Store the request for checking next time around
                    cacheLastRequest = $.extend( true, {}, request );
             
                    if ( ajax ) {
                        // Need data from the server
                        if ( requestStart < cacheLower ) {
                            requestStart = requestStart - (requestLength*(conf.pages-1));
             
                            if ( requestStart < 0 ) {
                                requestStart = 0;
                            }
                        }
                         
                        cacheLower = requestStart;
                        cacheUpper = requestStart + (requestLength * conf.pages);
             
                        request.start = requestStart;
                        request.length = requestLength*conf.pages;
             
                        // Provide the same `data` options as DataTables.
                        if ( typeof conf.data === 'function' ) {
                            // As a function it is executed with the data object as an arg
                            // for manipulation. If an object is returned, it is used as the
                            // data object to submit
                            var d = conf.data( request );
                            if ( d ) {
                                $.extend( request, d );
                            }
                        }
                        else if ( $.isPlainObject( conf.data ) ) {
                            // As an object, the data given extends the default
                            $.extend( request, conf.data );
                        }
                        
                        settings.jqXHR = self.presenter.getVideos((request.start / 10) + 1, function(data, count)
                        {
                            var events = [];
                            
                            $.each( data.videos, function( key, value )
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
                                
                                events.push([
                                  value.thumbnail + "_s.jpg",
                                  cameraName,
                                  moment(value.created_at).fromNow(),
                                  moment.utc(value.length * 1000).format('HH:mm:ss'),
                                  value.address
                                ]);
                            });
                            
                            var json = {
                                "draw": request.draw,
                                "recordsTotal": count,
                                "recordsFiltered": count,
                                "data": events
                            };
                            
                            cacheLastJson = $.extend(true, {}, json);
             
                            if ( cacheLower != drawStart )
                            {
                                json.data.splice( 0, drawStart-cacheLower );
                            }
                            if ( requestLength >= -1 )
                            {
                                json.data.splice( requestLength, json.data.length );
                            }
                             
                            drawCallback(json);
                        });
                    }
                    else
                    {
                        json = $.extend( true, {}, cacheLastJson );
                        json.draw = request.draw; // Update the echo for each response
                        json.data.splice( 0, requestStart-cacheLower );
                        json.data.splice( requestLength, json.data.length );
             
                        drawCallback(json);
                    }
                }
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