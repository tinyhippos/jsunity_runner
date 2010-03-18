/*
 * Class: Event
 * Purpose: publish-subscribe Event class for DOM based and non-DOM based event facilitation
 */
(jsUnityRunner.Event = function ($){

    var _listeners = {};

    return {
		
        eventTypes: {
            synchronousTest: "synchronousTest",
            synchronousSuite: "synchronousSuite"
        },

        on: function (eventType, listener, scope) {
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateMultipleArgumentTypes(arguments, ["string", "function", "object"]);
			var listenerList = _listeners[eventType] = _listeners[eventType] || [];
			listenerList.push([listener, scope]);
        },

        trigger: function (eventType, args) {
			args = args || [];
            $.Utils.validateNumberOfArguments(1, 2, arguments.length);
			$.Utils.validateMultipleArgumentTypes(arguments, ["string", "array"]);

            if (!_listeners || !_listeners[eventType]) {
                return;
            }

			var i, listenerList = _listeners[eventType];

			for (i = 0; i < listenerList.length; i+=1) {

                try {
                    listenerList[i][0].apply(listenerList[i][1], args);
                }
                catch (e) {
                    $.Exception.handle(e);
                }
            }
        },

		eventHasSubscriber: function (eventType){
			$.Utils.validateNumberOfArguments(1, 1, arguments.length);
			$.Utils.validateArgumentType(eventType, "string");
			return _listeners[eventType] ? true : false;
        },

        getEventSubscribers: function (eventType) {
			$.Utils.validateNumberOfArguments(1, 1, arguments.length);
			$.Utils.validateArgumentType(eventType, "string");
            return _listeners[eventType] || [];
        }

    };

}(jsUnityRunner));