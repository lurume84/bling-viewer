(function(views)
{
    var self;

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
                    self.initCalendar();
                    self.presenter.getVideos();
                    evt.preventDefault();
                });
                
                activity.appendTo($(".drawer .navigation"));
            },
            enumerable: false
        },
        initCalendar : {
            value: function()
            {
                $(".header > div > span").html("Activity");
                $(".content").html("<div class='calendar'></div>");
                
               $('.content .calendar').fullCalendar({
                  editable: false,
                  eventLimit: true, // allow "more" link when too many events
                  events: [],
                  header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                  }
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var events = [];
                
                $.each( data, function( key, value )
                {
                    events.push({
                      title: value.camera_name,
                      start: moment(value.created_at).toString(),
                      end: moment(value.created_at).add(value.length, 'seconds').toString(),
                      allDay: false
                    });
                });
                
                $('.content .calendar').fullCalendar('renderEvents', events, true);
                console.log(events);
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