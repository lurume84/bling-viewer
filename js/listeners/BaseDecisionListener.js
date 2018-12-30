(function(listeners)
{
    function BaseDecisionListener(onSuccess, onError)
    {
        this.onSuccess = onSuccess;
        this.onError = onError;
    }

    Object.defineProperties(BaseDecisionListener.prototype,
    {
        //public methods
        
    });

    listeners.BaseDecisionListener = BaseDecisionListener;
})(blink.listeners);