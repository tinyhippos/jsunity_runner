(jsUnityRunner.Persistence = function($){

    var localStorage = (window && window.localStorage) || null;

	function _validateAndSetPrefix(prefix) {
		if (prefix) {
			$.Utils.validateArgumentType(prefix, "string");
		}

		return prefix || $.Constants.common.prefix;
	}

	return {
		save: function (key, value, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.save");
            if (value) {
                $.Utils.validateArgumentType(value, "string");
            }

            localStorage[_validateAndSetPrefix(prefix)+key] = value;

            $.Event.trigger($.Event.eventTypes.storageUpdated, [key, prefix, value, false]);
		},

		saveObject: function (key, obj, prefix){
			$.Utils.validateNumberOfArguments(2, 3, arguments.length);
			$.Utils.validateArgumentType(key, "string", null, "Persistence.saveObject");
            
            if (obj) {
                $.Utils.validateArgumentType(obj, "object");
            }

            prefix = _validateAndSetPrefix(prefix);
            localStorage[prefix+key] = JSON.stringify(obj);

            $.Event.trigger($.Event.eventTypes.storageUpdated, [key, prefix, obj, false]);
		},

		retrieve: function (key, prefix){
            $.Utils.validateNumberOfArguments(1, 2, arguments.length);
            $.Utils.validateArgumentType(key, "string", null, "Persistence.retrieve");

            return localStorage[_validateAndSetPrefix(prefix)+key];
		},

		retrieveObject: function (key, prefix){
            $.Utils.validateNumberOfArguments(1, 2, arguments.length);
            $.Utils.validateArgumentType(key, "string");

            var retrievedValue = localStorage[_validateAndSetPrefix(prefix)+key];
            return retrievedValue ? JSON.parse(retrievedValue) : retrievedValue;
		},

		remove: function (key, prefix){
            $.Utils.validateNumberOfArguments(1, 2, arguments.length);
            $.Utils.validateArgumentType(key, "string", null, "Persistence.remove");

            prefix = _validateAndSetPrefix(prefix);

            var item = localStorage[prefix+key];

            localStorage.removeItem(prefix+key);

            $.Event.trigger($.Event.eventTypes.storageUpdated, [key, prefix, item, true]);
		},

        removeAll: function (prefix) {
            $.Utils.validateNumberOfArguments(0, 1, arguments.length);

            var key,
                temp;

            prefix = _validateAndSetPrefix(prefix);

            // loop over keys and regex out the ones that have our prefix and delete them
            for (key in localStorage) {
                if (key.match("^"+prefix)) {
                    temp = localStorage[key];
                    localStorage.removeItem(key);
                    $.Event.trigger($.Event.eventTypes.storageUpdated, [key, prefix, temp, true]);
                }
            }

        }
	};
}(jsUnityRunner));