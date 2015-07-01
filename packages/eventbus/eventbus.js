
EventBus = function() {
    var listeners = {};

    /*
    registers a function to an event
     */
    this.register = function(event, fn) {
        if(typeof event === 'string' && typeof fn === 'function') {
            var cbs = listeners[event] || [];
            if(cbs.indexOf(fn) < 0) {
                cbs.push(fn);
                listeners[event] = cbs;
            }
            return true;
        } else {
            return false;
        }
    };

    /*
    this dispatches an event
    can pass any number of arguments through
     */
    this.dispatch = function(event) {
        if(typeof event === 'string') {
            var cbs = listeners[event];
            var args = Array.prototype.slice.call(arguments, 1);
            if(cbs) {
                cbs.forEach(function(fn) {
                    fn.apply(null, args);
                });
            }
        }
    };

    /*
    unregisters a function against an event
    if function is omitted, the entire list of listeners for event is removed
     */
    this.unregister = function(event, fn) {
        if(typeof event === 'string' && typeof fn === 'function') {
            var cbs = listeners[event];
            if (cbs && cbs.length) {
                var index = cbs.indexOf(fn);
                cbs.splice(index, 1);
            }
            return true;
        } else if(typeof event === 'string') {
            delete listeners[event];
            return true;
        } else {
            return false;
        }
    };

}
