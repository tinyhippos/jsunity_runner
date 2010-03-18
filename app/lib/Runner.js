// ----------------- Runner ----------------- \\

(jsUnityRunner.Runner = function ($){

	var _suites = [],
		_markup,
		_amountOfTests = 0,
		_amountOfCompletedTests = 0,
		_progress_failed = false;

    return {

		// Public Methods
        run: function (whatToRun, verbose){

			try{

				_markup = document.getElementById($.Constants.RUNNER_SELECTOR).innerHTML;
				_progress_failed = false;

				this.clear();

				$.Logger.verbose = verbose || false;

				switch (whatToRun) {
					
					case "all":

						jsUnity.run.apply(jsUnity, _suites);
						
						break;

					default:
						
						if(!_suites[parseInt(whatToRun, 10)]){
							$.Exception.raise($.Exception.types.TestSuite, "Uknown test suite, can not run Test Suite(s).");
						}else{
							setTimeout(function(){
								jsUnity.run(_suites[parseInt(whatToRun, 10)]);
							},0);
						}
						
				}

			}
			catch(e){
				$.Logger.log(e);
				$.Exception.handle(e);
			}

			return false;

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

			document.getElementById($.Constants.RUNNER_SELECTOR).appendChild($.Utils.createElement("option", {
					"value": count,
					"innerHTML":  suite.suiteName || "Uknown Test Suite"
				}));

		},

		clear: function (){
			document.getElementById($.Constants.PROGRESS_SCROLL).style.width = 0;
			document.getElementById($.Constants.PROGRESS_DIV).innerHTML = "";
			_amountOfTests = 0;
			_amountOfCompletedTests = 0;
			$.Logger.clear();
		},
		
		resetMarkup: function (){
			document.getElementById($.Constants.MARKUP_DIV).innerHTML = _markup;
		},

		// methods called fby jsUnity itself

		updateResults: function (results){
			var total = results.passed + results.failed;
            $.Logger.log("<br /><br /><strong>RESULTS:</strong><br />");
            $.Logger.log(results.passed + " passed");
            $.Logger.log(results.failed + " failed");
            $.Logger.log(results.duration + "ms elapsed for " + total + " tests");
		},

		updateProgress: function (){
			_amountOfCompletedTests++;
			document.getElementById($.Constants.PROGRESS_DIV).innerHTML = _amountOfCompletedTests + " /" + _amountOfTests;
			document.getElementById($.Constants.PROGRESS_SCROLL).style.width = ((_amountOfCompletedTests / _amountOfTests) * 100) + "%";
			document.getElementById($.Constants.PROGRESS_SCROLL).style.backgroundColor = (_progress_failed ? "red" : "#40D940");
		},

		updateAmountOfTests: function (suiteLength){
			_amountOfTests += suiteLength;
		},

		passTest: function (test){
			$.Logger.log('[PASSED]  ' + test.name, "green");
			this.updateProgress();
		},

		failTest: function (test, error){
			_progress_failed = true;
			$.Logger.log('[FAILED]  ' + test.name + ' :: ' + error, "red");
			$.Logger.warn(test.name + " --> " + error);
			this.updateProgress();
		},

		startSuite: function (suite, count, countStr){

			if(suite.resetMarkup === true) {
				this.resetMarkup();
			}
			
			$.Logger.warn("<strong>Running " + (suite.suiteName || "unnamed test suite") + "</strong>");
			$.Logger.warn(countStr + " found");
			$.Logger.log("------- " + suite.suiteName + "-------");
			
		}
        
    };
    
}(jsUnityRunner));



