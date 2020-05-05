(function(interactors)
{
    function LoginInteractor()
    {
        
    }

    Object.defineProperties(LoginInteractor.prototype,
    {
        login : {
            value: function(user, password, uid, notification_key, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://prod." + server + "/api/v4/account/login",
					data: {	"app_version":"6.0.7 (520300) #afb0be72a", "client_name": "Computer", 
							"client_type": "android", "device_identifier": "Bling Desktop", 
							"email": user, "notification_key": notification_key, "os_version": "5.1.1", "password": password, 
							"reauth":true, "unique_id": uid},
					dataType: 'json',
					beforeSend: function(xhr) { 
						
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
		verify : {
            value: function(key, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://rest-" + credentials.region + "." + server + "/api/v4/account/" + credentials.account.id + "/client/" + credentials.client.id + "/pin/verify/",
					data: {"pin": key},
					dataType: 'json',
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
						xhr.setRequestHeader("ACCOUNT_ID", credentials.account.id);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        setToken : {
            value: function(data, listener)
            {
                $.ajax
				({
					type: "POST",
					url: "/data/token.json",
					data: JSON.stringify(data),
					dataType: 'json',
                    contentType: 'application/json',
                    beforeSend: function(xhr)
                    {
                        //$.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        },
        getToken : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "/data/token.json",
					dataType: 'json',
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        getUser : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "https://rest-" + credentials.region + "." + server + "/user",
					dataType: 'json',
					beforeSend: function(xhr) {                        
						xhr.setRequestHeader("TOKEN_AUTH", credentials.token);
						xhr.setRequestHeader("ACCOUNT_ID", credentials.account.id);
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
		getVersion : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "/version",
					success: function (data)
					{
						listener.onSuccess(data);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr);
					}
				});
            },
            enumerable: false
        }
    });

    interactors.LoginInteractor = LoginInteractor;
})(blink.interactors);
