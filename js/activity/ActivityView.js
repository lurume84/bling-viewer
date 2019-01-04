(function(views)
{
    var self;
    var timeline;

    function ActivityView(presenter)
    {
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
                var self = this;
                
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
                $(".content").html("<table class='activity' class='display' width='100%'></table>");
                
                this.cameras = cameras;
                
                var self = this;
                
                $.fn.dataTable.pipeline = function (opts)
                {
                    // Configuration options
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
                                
                                $.each( data, function( key, value )
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
                                      "<img id='image" + value.id + "'/>",
                                      cameraName,
                                      moment(value.created_at).fromNow(),
                                      moment.utc(value.length * 1000).format('HH:mm:ss')
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
                };
                 
                // Register an API method that will empty the pipelined data, forcing an Ajax
                // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
                $.fn.dataTable.Api.register( 'clearPipeline()', function () {
                    return this.iterator( 'table', function ( settings ) {
                        settings.clearCache = true;
                    } );
                } );

                $('.content table.activity').dataTable(
                    {
                        columns: [
                            {title: ""},
                            {title: "Camera"},
                            {title: "Time"},
                            {title: "Duration"}],
                        processing: true,
                        serverSide: true,
                        ordering: false,
                        searching: false,
                        bLengthChange: false,
                        scroller: {
                            loadingIndicator: true
                        },
                        ajax: $.fn.dataTable.pipeline(
                        {
                            pages: 1 // number of pages to cache
                        } )
                    });
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