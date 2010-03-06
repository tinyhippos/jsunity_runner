var jsUnityWrapper = { Tests: {} };

// ----------------- Runner ----------------- \\

(jsUnityWrapper.Runner = function ($){

	var _LOGGER_DIV = "logger",
		_RUNNER_SELECTOR = 'runner_selector',
		_suites = [];

    return {

        run: function (){
			var suite;

			for (suite in _suites){
				jsUnity.run(_suites[suite]);
			}
			
			_suites = [];
        },

		loadTests: function (){
			var suite;

			for (suite in $.Tests){
				if($.Tests.hasOwnProperty(suite)){
					_suites.push($.Tests[suite]);
					this.loadOption($.Tests[suite]);
				}
			}

		},

		loadOption: function (suite){

			var el = document.createElement("option"),
				suite = suite.suiteName || "Uknown Test Suite";
				
			el.setAttribute("value", suite);
			el.innerHTML = suite;

			document.getElementById(_RUNNER_SELECTOR).appendChild(el);

		},
        
        logError: function (e){
            this.log('<span style="color: red;"><br/>'+e.stack+"<br/>");
        },

        log: function (e){
            document.getElementById(_LOGGER_DIV).innerHTML += "<br />"+e;
        },

        clear: function (){
            document.getElementById(_LOGGER_DIV).innerHTML = "";
        }
        
    };
    
}(jsUnityWrapper));



// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){
	jsUnityWrapper.Runner.loadTests();
});


jsUnity.error = function (eStr){
    jsUnityWrapper.Runner.logError(eStr);
}


jsUnity.log = function (eStr){
    jsUnityWrapper.Runner.log(eStr);
}
