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
                this.cameras = data;
                this.events = [];
                this.currentPage = 0;
                this.presenter.getVideosPage(0);
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var self = this;
                
                this.currentPage++;
                
                $.each( data, function( key, value )
                {
                    self.events.push({
                      label: value.camera_name,
                      content: value.camera_name,
                      start: moment(value.created_at).format("YYYY-MM-DD hh:mm:ss"),
                      end: moment(value.created_at).add(value.length, 'seconds').format("YYYY-MM-DD hh:mm:ss"),
                      row: $("#timeline_camera" + value.camera_id).data("idx"),
                      size: 80,
                      y: 25
                    });
                });
                
                this.initTimeline();
            },
            enumerable: false
        },
        initTimeline : {
            value: function()
            {
                var events = [];
                
                for(var i = 0; i < this.events.length;++i)
                {
                    events.push("<li data-timeline-node='" + JSON.stringify(this.events[i]) + "'><h3 class=\"event-label\">" + this.events[i].label + "</h3><p class=\"event-content\">" + this.events[i].content + "</p></li>");
                }
                
                $(".header > div > span").html("Activity");
                $(".content").html("<div class='progress mdl-progress mdl-js-progress mdl-progress__indeterminate'></div><div class='timeline'>" + 
                                    "<ul class='timeline-events'> " + events + " </ul></div><div class='more'><a href='#'>Load more</a></div>");
                
                var self = this;
                
                $(".content .more > a").click(function(evt)
                {
                    self.presenter.getVideosPage(self.currentPage);
                    evt.preventDefault();
                });
                
                componentHandler.upgradeAllRegistered();
                
                var list = [];
                
                for(var i = 0; i < this.cameras.length; ++i)
                {
                    var type = this.cameras[i].type == "xt" ? "xt" : "indoor";
                    list.push("<div data-idx='" + (i + 1) + "' id='timeline_camera" + this.cameras[i].camera_id + "'><span class='avatar-icon'><img src='img/" + type + ".png' class='rounded'></span>" + this.cameras[i].name + "</div>");
                }
                
                console.log(this.events[this.events.length - 1].start)
                console.log(this.events[0].start)
                
                var options = {
                    type          : 'point',
                    rangeAlign	  : 'left',
                    width           : "60vw",
                    height          : "auto",
                    minGridSize     : 100,
                    scale         : 'day',
                    rowHeight     : 100,
                    startDatetime   : this.events[this.events.length - 1].start,
                    endDatetime   : this.events[0].start,
                    loader        : false,
                    headline      : {
                        display   : true,
                        title     : '',
                        range     : true,
                        locale    : 'en-US',
                        format    : { timeZone: 'Europe/Brussels', hour12: false, year: 'numeric', month: 'long', day: 'numeric' }
                    },
                    footer        : {
                        display   : true,
                        content   : '',
                        range     : true,
                        locale    : 'en-US',
                        format    : { hour12: false, year: 'numeric', month: 'short', day: '2-digit' }
                    },
                    sidebar       : {
                        sticky : true,
                        list   : list
                    },
                    ruler         : {
                        top    : {
                            lines      : [ 'year', 'month', 'day', 'hour' ],
                            height     : 23,
                            fontSize   : 14,
                            color      : '#777',
                            background : '#FFF',
                            locale     : 'en-US',
                            format     : { timeZone: 'Europe/Brussels', hour12: false, decade: 'ordinal', lustrum: 'ordinal', year: 'zerofill', month: 'long', weekday: 'long', hour: 'numeric', minute: 'numeric' },
                        }
                    },
                    eventMeta       : {
                        display     : false,
                        scale       : 'hour',
                    },
                    zoom          : true
                };
                
               this.timeline = $('.content .timeline').Timeline(options);
               
               $(".content .progress").hide();
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

    views.ActivityView = ActivityView;
})(blink.views);