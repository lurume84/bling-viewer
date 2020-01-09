(function(interactors)
{
    function CameraInteractor()
    {
        
    }

    Object.defineProperties(CameraInteractor.prototype,
    {
        getCamera : {
            value: function(networkId, cameraId, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/network/" + networkId + "/camera/" + cameraId,
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
        },
        getThumbnail : {
            value: function(path, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + path + ".jpg",
                    mimeType: "text/plain; charset=x-user-defined",
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
					},
					success: function (data)
					{
						listener.onSuccess(base64Encode(data));
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        requestThumbnail : {
            value: function(network, camera, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://rest-" + credentials.region + "." + server + "/network/" + network + "/camera/" + camera + "/thumbnail",
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
        },
        requestLiveView : {
            value: function(network, camera, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://rest-" + credentials.region + "." + server + "/api/v3/networks/" + network + "/cameras/" + camera + "/liveview",
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
        },
        checkCommand : {
            value: function(network, command, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/network/" + network + "/command/" + command,
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
        },
        joinCommand : {
            value: function(network, camera, command, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/api/v3/networks/" + network + "/cameras/" + camera + "/join/" + command,
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
        },
        updateCommand : {
            value: function(network, command, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://rest-" + credentials.region + "." + server + "/network/" + network + "/update",
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
        },
        requestJoin : {
            value: function(camera, url, listener)
            {
                if(url.substring(0, 8) == "rtsps://")
                {
                    url = "immis://" + url.substring(8) + "&blinkRTSP=true";
                }
                
				$.ajax
				({
					type: "POST",
					url: "http://127.0.0.1:9191/live",
                    data: JSON.stringify({camera_id: camera, url: url}),
                    dataType: 'json',
                    contentType: 'application/json',
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
        },
        requestUnjoin : {
            value: function( camera, listener)
            {
				$.ajax
				({
					type: "DELETE",
					url: "http://127.0.0.1:9191/live",
                    data: JSON.stringify({camera_id: camera}),
                    dataType: 'json',
                    contentType: 'application/json',
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
        },
    });

    interactors.CameraInteractor = CameraInteractor;
})(blink.interactors);
