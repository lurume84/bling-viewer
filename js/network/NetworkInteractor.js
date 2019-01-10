(function(interactors)
{
    function NetworkInteractor()
    {
        
    }

    Object.defineProperties(NetworkInteractor.prototype,
    {
        getNetworks : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/networks/",
					dataType: 'json',
                    crossDomain: true,
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
        },
        getNetwork : {
            value: function(networkId, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/network/" + networkId + "/cameras",
					dataType: 'json',
                    crossDomain: true,
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

    interactors.NetworkInteractor = NetworkInteractor;
})(blink.interactors);