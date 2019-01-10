(function(interactors)
{
    function ActivityInteractor()
    {
        
    }

    Object.defineProperties(ActivityInteractor.prototype,
    {
        getVideos : {
            value: function(page, listener)
            {
				return $.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/api/v2/videos/page/" + page,
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
        getVideosCount : {
            value: function(listener)
            {
				return $.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/api/v2/videos/count",
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
        getMedia : {
            value: function(path, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + path,
                    mimeType: "text/plain; charset=x-user-defined",
                    crossDomain: true,
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
					},
					success: function (data)
					{
						listener.onSuccess(base64Encode(data));
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(error);
					}
				});
            },
            enumerable: false
        },
        downloadMedia : {
            value: function(path, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + path,
                    crossDomain: true,
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
					},
                    xhrFields: {
                        responseType: 'blob'
                    },
					success: function (data)
					{
						listener.onSuccess(data);
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

    interactors.ActivityInteractor = ActivityInteractor;
})(blink.interactors);