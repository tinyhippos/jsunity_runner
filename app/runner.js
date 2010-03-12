var jsUnityRunner = { Tests: {} };

// ----------------- Runner ----------------- \\

(jsUnityRunner.Runner = function ($){

	var _RUNNER_SELECTOR = 'runner_selector',
		_MARKUP_DIV = 'markup',
		_suites = [],
		_markup;

    return {

        run: function (whatToRun, verbose){

			try{

				_markup = document.getElementById(_MARKUP_DIV).innerHTML;

				$.Logger.clear();

				$.Logger.verbose = verbose || false;

				switch (whatToRun) {
					
					case "all":
					
						jsUnity.run.apply(jsUnity, _suites);
						break;

					default:
						
						if(!_suites[parseInt(whatToRun, 10)]){
							$.Exception.throwException("TestSuiteException", "Uknown test suite, can not run Test Suite(s).");
						}else{
							jsUnity.run(_suites[parseInt(whatToRun, 10)]);
						}
						
				}

			}
			catch(e){
				$.Logger.log(e);
				$.Exception.handle(e);
			}

        },

		loadTests: function (){
			var suite,
				count = 0;

			for (suite in $.Tests){ if($.Tests.hasOwnProperty(suite)){
				_suites.push($.Tests[suite]);
				this.loadOption($.Tests[suite], count);
				count++;
			}}

		},

		loadOption: function (suite, count){

			document.getElementById(_RUNNER_SELECTOR).appendChild($.Utils.createElement("option", {
					"value": count,
					"innerHTML":  suite.suiteName || "Uknown Test Suite"
				}));

		},

		resetMarkup: function (){
			document.getElementById(_MARKUP_DIV).innerHTML = _markup;
		}
        
    };
    
}(jsUnityRunner));

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){
	jsUnityRunner.Runner.loadTests();
});


jsUnity.error = function (eStr){
    jsUnityRunner.Logger.logError(eStr);
}


jsUnity.log = function (eStr){
    jsUnityRunner.Logger.log(eStr);
}
