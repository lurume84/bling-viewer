(function(interactors)
{
    function HomescreenInteractor()
    {
        
    }

    Object.defineProperties(HomescreenInteractor.prototype,
    {
        get : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/api/v3/accounts/" + credentials.account.account_id + "/homescreen",
                    dataType: 'json',
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
					},
					success: function (data)
					{
						listener.onSuccess(data);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        }
    });

    interactors.HomescreenInteractor = HomescreenInteractor;
})(blink.interactors);
