(jsUnityRunner.Exception = function ($){

	return {

        types: {
            ArgumentLength: "ArgumentLength",
            ArgumentType: "ArgumentType",
            Argument: "Argument", 
            DomObjectNotFound: "DomObjectNotFound",
            MethodNotImplemented: "MethodNotImplemented",
            InvalidState: "InvalidState",
            TestSuite: "TestSuiteException",
            ConsoleNotFound: "ConsoleNotFound",
            ConsoleMethodNotFound: "ConsoleMethodNotFound"
        },

        handle: function(exception, reThrow, logToConsole){
            $.Utils.validateNumberOfArguments(1, 3, arguments.length);

            reThrow = reThrow || false;

            var eMsg = exception.message || "exception caught!",
                msg = eMsg+"\n\n"+(exception.stack || "*no stack provided*")+"\n\n";

            if($.Console.isAvailable() && logToConsole){ $.Console.error(msg); }

            if (reThrow){
                throw exception;
            }
        },

        raise: function(exceptionType, message, customExceptionObject){
            $.Utils.validateNumberOfArguments(1, 3, arguments.length);

            var obj = customExceptionObject || {};
            message = message || "";

            $.Utils.validateMultipleArgumentTypes([exceptionType, message, obj], ['string', 'string', 'object']);

            obj.name = exceptionType;
            obj.type = exceptionType;
            obj.message = message;
            
            if($.Console.isAvailable()){ $.Console.error(obj); }

            throw obj;
        }


	};

}(jsUnityRunner));