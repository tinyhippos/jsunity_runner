(jsUnityRunner.API = function ($){

	var _results = new jsUnity.TestResults(),
		_suites = [],
		_suiteNames = [],
		_synchronousSuiteIndex,
		_synchronousTestIndex,
		_startTime;

    // copied from jsUnity since its a private method.
	function _plural(cnt, unit) {
        return cnt + " " + unit + (cnt == 1 ? "" : "s");
    }

	function _finalizeResults(){
		
		_results.suiteName = _suiteNames.join(",");
		_results.failed = _results.total - _results.passed;
		_results.duration = new Date().getTime() - _startTime;

		$.Runner.updateResults(_results);
		
	}

	return {

        // override of jsUnity.run
        run: function(){

			var i;

			_synchronousTestIndex = 0;
			_synchronousSuiteIndex = 0;
			_results = new jsUnity.TestResults();
			_suites = [];
			_suiteNames = [];

			for (i = 0; i < arguments.length; i++) {
				// TODO: validate a Test Suite
				try {
					_suites.push(jsUnity.compile(arguments[i]));
				}
				catch (e) {
					if($.Console.isAvailable()) {$.Console.error("TestSuite exception :: " + e); }
					return false;
				}
			}
			_startTime = new Date().getTime();
			// initiate iterative scenario
			setTimeout(function (){
				$.Event.trigger($.Event.eventTypes.synchronousSuite);
			}, 0);

		},

        // iterate through current test suite's tests
		synchronousTest: function (){

			var suite = _suites[_synchronousSuiteIndex],
				test = _suites[_synchronousSuiteIndex].tests[_synchronousTestIndex];

			try{
				
				suite.setUp && suite.setUp();
				
				test.fn.call(suite.scope);

				suite.tearDown && suite.tearDown();

				_results.passed++;
				
				$.Runner.passTest(test);
			
			} catch (e) {

				$.Exception.handle(e);

				suite.tearDown && suite.tearDown();

				$.Runner.failTest(test, e);
			}

			// if still tests left, go to next test (if possible)
			_synchronousTestIndex++;
			
			if(_synchronousTestIndex < suite.tests.length){
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronousTest);
				}, 0);
				
			}else{
				// all done, go to next Test Suite
				_synchronousSuiteIndex++;
				_synchronousTestIndex = 0;
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronousSuite);
				}, 0);
			}
			
		},

        // iterate over test suites to be run
		synchronousSuite: function (){

			// "recursive" base case
			if(_synchronousSuiteIndex < _suites.length){

				var suite = _suites[_synchronousSuiteIndex],
				suiteLength = suite.tests.length;

				$.Runner.startSuite(suite, suiteLength, _plural(suiteLength, "test"));

				_suiteNames.push(suite.suiteName);

				_results.total += suiteLength;

				$.Runner.updateAmountOfTests(suiteLength);
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronousTest);
				}, 0);
				
			}else{
				_finalizeResults();
			}
				
			
        }

	};

}(jsUnityRunner));