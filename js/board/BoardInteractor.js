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
					url: "https://rest-"+ $region +"." + server + "/networks/",
					dataType: 'json',
					beforeSend: function(xhr) { 
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
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