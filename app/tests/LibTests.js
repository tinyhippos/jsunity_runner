var jsUnityWrapper = { Tests: {} };

// ----------------- Runner ----------------- \\

(jsUnityWrapper.LibTests = function ($){

	var _RUNNER_SELECTOR = 'runner_selector',
		_suites = [];

    return {

        run: function (whatToRun){

			$.Logger.clear();

            $.Logger.verbose = verbose || false;

            switch (whatToRun) {
                
                case "all":
					jsUnity.run.apply(jsUnity, _suites);
                    break;
                default:
                    throw {name: "TestSuiteException", message: "Uknown test suite, can not run Test Suite(s)." };
            }

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

		verbose: false,

        logError: function (e){
            this.log('<span style="color: red;"><br/>'+e.stack+"<br/>");
        },

        log: function (e){
            document.getElementById(LOGGER_DIV).innerHTML += "<br />"+e;
        },
        
        note: function (e){
            if(this.verbose){
                document.getElementById(LOGGER_DIV).innerHTML += "<br /><span style=\"color: #FF4848\">"+e+"<span>";
            }
        },

        clear: function (){
            document.getElementById(LOGGER_DIV).innerHTML = "";
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
