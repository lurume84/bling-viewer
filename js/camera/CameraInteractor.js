(function(interactors)
{
    function CameraInteractor()
    {
        
    }

    Object.defineProperties(CameraInteractor.prototype,
    {
        getThumbnail : {
            value: function(path, listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + path + ".jpg",
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
        }
    });

    interactors.CameraInteractor = CameraInteractor;
})(blink.interactors);