// ----------------- Runner ----------------- \\

(jsUnityRunner.Runner = function ($){

	var _suites = [],
		_markup,
        _results = {
            "totalTests": 0,
            "completedTests": 0,
            "failedTests": 0,
            "passedTests": 0
        },
		_progress_failed = false,
        _startTime;

    function _countTests(suiteArray){
        var test,
            temp = 0,
            i;

        for(i = 0; i < suiteArray.length; i++){
            for(test in suiteArray[i]){ if(suiteArray[i].hasOwnProperty(test)){
                    if(test.match(/^test/)){
                        temp++;
                    }
                }
            }
        }

        return temp;
    }

    return {

		// Public Methods
        run: function (whatToRun, verbose){

            var individualSuite;

			try{

				_markup = document.getElementById($.Constants.RUNNER_SELECTOR).innerHTML;
				_progress_failed = false;

				this.reset();

				$.Logger.verbose = verbose || false;

                if(whatToRun === "all"){
                    // TODO: figure out way to do this only once per load and not every run
                    _results.totalTests = _countTests(_suites);
                    _startTime = new Date().getTime();
                    jsUnity.run.apply(jsUnity, _suites);
                }
                else{
                    individualSuite = _suites[parseInt(whatToRun, 10)];
                    if(!individualSuite){
                        $.Exception.raise($.Exception.types.TestSuite, "Uknown test suite, can not run Test Suite(s).");
                    }else{
                        _results.totalTests = _countTests( [individualSuite] );
                        _startTime = new Date().getTime();
                        jsUnity.run(individualSuite);
                    }
                }

			}
			catch(e){
				$.Logger.log(e);
				$.Exception.handle(e);
			}
            
			return false;

        },

        complete: function(){
            var endTime = (new Date().getTime() - _startTime);
            $.Utils.id($.Constants.RUNNER_STATUS_DIV).innerHTML = endTime + " ms elapsed";
            $.Logger.warn("<br />Completed Test Run! (" + endTime + " ms)");
        },

		loadTestSuites: function (){
			var suite,
				count = 0,
                test;

			for (suite in $.Tests){ if($.Tests.hasOwnProperty(suite)){
				_suites.push($.Tests[suite]);
				this.loadOption($.Tests[suite], count);
				count++;
			}}

		},

		loadOption: function (suite, count){

			$.Utils.id($.Constants.RUNNER_SELECTOR).appendChild($.Utils.createElement("option", {
					"value": count,
					"innerHTML":  suite.suiteName || "Uknown Test Suite"
				}));

		},

		reset: function (){
			$.Utils.id($.Constants.PROGRESS_SCROLL).style.width = 0;
			$.Utils.id($.Constants.PROGRESS_DIV).innerHTML = "";
			$.Utils.id($.Constants.RUNNER_STATUS_DIV).innerHTML = "";
			$.Utils.id($.Constants.RUNNER_RESULTS_DIV).innerHTML = "";
			_results.totalTests = 0;
			_results.completedTests = 0;
            _results.failedTests = 0;
            _results.passedTests = 0;
			$.Logger.clear();
		},
		
		resetMarkup: function (){
			$.Utils.id($.Constants.MARKUP_DIV).innerHTML = _markup;
		},

        // updates progress.
		updateProgress: function (test){
			try{
                var str;

                if(test.failed){
                    _results.failedTests++;
                    _progress_failed = true;
                    $.Logger.log('[FAILED]  <span style="color: black">' + test.name + '</span><br />--> ' + test.messages.join("<br />--> "), "red");
                    //$.Logger.warn(test.name + " --> " + error);
                }else{
                    _results.passedTests++;
                    $.Logger.log('[PASSED]  <span style="color: black">' + test.name + "</span>", "green");
                }

                _results.completedTests++;
                $.Utils.id($.Constants.PROGRESS_DIV).innerHTML = _results.completedTests + " /" + _results.totalTests;
                $.Utils.id($.Constants.PROGRESS_SCROLL).style.width = ((_results.completedTests / _results.totalTests) * 100) + "%";
                $.Utils.id($.Constants.PROGRESS_SCROLL).style.backgroundColor = (_progress_failed ? "red" : "#40D940");

                str =  _results.passedTests + " passed :: " + _results.failedTests + " failed";
                $.Utils.id($.Constants.RUNNER_RESULTS_DIV).innerHTML = str;
            }
            catch(e){
                $.Exception.handle(e);
            }
		},

		notifySuiteStart: function (suite){

			if(suite.resetMarkup === true) {
				this.resetMarkup();
			}
			
			$.Logger.warn("Running " + (suite.suiteName || "unnamed test suite"));
			$.Logger.warn(suite.tests.length + " tests found");
			$.Logger.log("<strong>" + suite.suiteName + "</strong>");
			
		}
        
    };
    
}(jsUnityRunner));



