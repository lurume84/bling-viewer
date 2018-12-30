(function(interactors)
{
    function BoardInteractor()
    {
        
    }

    Object.defineProperties(BoardInteractor.prototype,
    {
        getList : {
            value: function(startAt, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "" + startAt,
					dataType: 'json',
					beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + btoa(":")); 
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(error);
					}
				});
            },
            enumerable: false
        }
        
    });

    interactors.BoardInteractor = BoardInteractor;
})(blink.interactors);