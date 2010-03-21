// ----------------- Runner ----------------- \\

(jsUnityRunner.Runner = function ($){

	var _suites = [],
		_markup,
		_amountOfTests = 0,
		_amountOfCompletedTests = 0,
        _failedAmount = 0,
        _passedAmount = 0,
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

				this.clear();

				$.Logger.verbose = verbose || false;

                if(whatToRun === "all"){
                    // TODO: figure out way to do this only once per load and not every run
                    _amountOfTests = _countTests(_suites);
                    _startTime = new Date().getTime();
                    jsUnity.run.apply(jsUnity, _suites);
                }
                else{
                    individualSuite = _suites[parseInt(whatToRun, 10)];
                    if(!individualSuite){
                        $.Exception.raise($.Exception.types.TestSuite, "Uknown test suite, can not run Test Suite(s).");
                    }else{
                        _amountOfTests = _countTests( [individualSuite] );
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

        end: function(){
            var endTime = (new Date().getTime() - _startTime);
            document.getElementById($.Constants.RUNNER_STATUS_DIV).innerHTML = endTime + " ms elapsed";
            $.Logger.warn("<br />Completed Test Run! (" + endTime + " ms)");
        },

		loadTests: function (){
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

			document.getElementById($.Constants.RUNNER_SELECTOR).appendChild($.Utils.createElement("option", {
					"value": count,
					"innerHTML":  suite.suiteName || "Uknown Test Suite"
				}));

		},

		clear: function (){
			document.getElementById($.Constants.PROGRESS_SCROLL).style.width = 0;
			document.getElementById($.Constants.PROGRESS_DIV).innerHTML = "";
			document.getElementById($.Constants.RUNNER_STATUS_DIV).innerHTML = "";
			document.getElementById($.Constants.RUNNER_RESULTS_DIV).innerHTML = "";
			_amountOfTests = 0;
			_amountOfCompletedTests = 0;
            _failedAmount = 0;
            _passedAmount = 0;
			$.Logger.clear();
		},
		
		resetMarkup: function (){
			document.getElementById($.Constants.MARKUP_DIV).innerHTML = _markup;
		},

        // updates progress.
		updateProgress: function (test){
			try{
                var str;

                if(test.failed){
                    _failedAmount++;
                    _progress_failed = true;
                    $.Logger.log('[FAILED]  <span style="color: black">' + test.name + '</span><br />--> ' + test.messages.join("<br />--> "), "red");
                    //$.Logger.warn(test.name + " --> " + error);
                }else{
                    _passedAmount++;
                    $.Logger.log('[PASSED]  <span style="color: black">' + test.name + "</span>", "green");
                }

                _amountOfCompletedTests++;
                document.getElementById($.Constants.PROGRESS_DIV).innerHTML = _amountOfCompletedTests + " /" + _amountOfTests;
                document.getElementById($.Constants.PROGRESS_SCROLL).style.width = ((_amountOfCompletedTests / _amountOfTests) * 100) + "%";
                document.getElementById($.Constants.PROGRESS_SCROLL).style.backgroundColor = (_progress_failed ? "red" : "#40D940");

                str =  _passedAmount + " passed :: " + _failedAmount + " failed";
                document.getElementById($.Constants.RUNNER_RESULTS_DIV).innerHTML = str;
            }
            catch(e){
                $.Exception.handle(e);
            }
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



