(function(interactors)
{
    function LoginInteractor()
    {
        
    }

    Object.defineProperties(LoginInteractor.prototype,
    {
        login : {
            value: function(user, password, listener)
            {
				$.ajax
				({
					type: "POST",
					url: "https://prod." + server + "/login",
					data: {"email": user, "password": password},
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
