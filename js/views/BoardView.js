(function(views)
{
    var self;

    function BoardView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(BoardView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).ready(function ()
                {
					$("#boardList").html("");
					
                    self.presenter.getList();
                });
            },
            enumerable: false
        },

        load : {
            value: function(data)
            {
                $.each( data.values, function( key, value )
                {
                    
                });

                if(data.isLast)
                {
                    
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

    views.BoardView = BoardView;
})(blink.views);