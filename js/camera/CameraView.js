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
                this.card = $("<div/>", {class: "demo-card-square mdl-card mdl-shadow--2dp"});
                    
                var title = $("<div/>", {class: "mdl-card__title mdl-card--expand", html: "<h2 class='mdl-card__title-text'>" + data.name + "</h2>"});
                var text = $("<div/>", {class: "mdl-card__supporting-text", html: "ola"});
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