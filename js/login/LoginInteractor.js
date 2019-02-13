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
        getToken : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
					url: "token.json",
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
        }
        
    });

    interactors.LoginInteractor = LoginInteractor;
})(blink.interactors);