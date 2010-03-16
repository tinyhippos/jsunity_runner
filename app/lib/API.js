(jsUnityRunner.API = function ($){

	var _results = new jsUnity.TestResults(),
		_suites = [],
		_suiteNames = [],
		_synchronusSuiteIndex,
		_synchronusTestIndex,
		_startTime;

	function _plural(cnt, unit) {
        return cnt + " " + unit + (cnt == 1 ? "" : "s");
    }

	function _finalizeResults(startTime){
		
		_results.suiteName = _suiteNames.join(",");
		_results.failed = _results.total - _results.passed;
		_results.duration = new Date().getTime() - _startTime;

		$.Runner.updateResults(_results);
		
	}

	return {

		synchronusTest: function (){

			var suite = _suites[_synchronusSuiteIndex],
				test = _suites[_synchronusSuiteIndex].tests[_synchronusTestIndex];

			try{
				
				suite.setUp && suite.setUp();
				
				test.fn.call(suite.scope);

				suite.tearDown && suite.tearDown();

				_results.passed++;
				
				$.Runner.passTest(test);
			
			} catch (e) {

				suite.tearDown && suite.tearDown();

				$.Runner.failTest(test, e);
			}

			// if still tests left, go to next test (if possible)
			_synchronusTestIndex++;
			
			if(_synchronusTestIndex < suite.tests.length){
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronusTest);
				}, 0);
				
			}else{
				// all done, go to next Test Suite
				_synchronusSuiteIndex++;
				_synchronusTestIndex = 0;
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronusSuite);
				}, 0);
			}
			
		},

		synchronusSuite: function (){

			// "recusive" base case
			if(_synchronusSuiteIndex < _suites.length){

				var suite = _suites[_synchronusSuiteIndex],
				suiteLength = suite.tests.length;

				$.Runner.startSuite(suite, suiteLength, _plural(suiteLength, "test"));

				_suiteNames.push(suite.suiteName);

				_results.total += suiteLength;

				$.Runner.updateAmountOfTests(suiteLength);
				
				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.synchronusTest);
				}, 0);
				
			}else{
				_finalizeResults(jsUnity.env.getDate());
			}
				
			
		},

		run: function(){
		
			var i;

			_synchronusTestIndex = 0;
			_synchronusSuiteIndex = 0;
			_results = new jsUnity.TestResults();
			_suites = [];
			_suiteNames = [];

			for (i = 0; i < arguments.length; i++) {
				// TODO: validate a Test Suite
				try {
					_suites.push(jsUnity.compile(arguments[i]));
				}
				catch (e) {
					console.error("TestSuite exception :: " + e);
					return false;
				}
			}
			_startTime = new Date().getTime();
			// initiate iterative scenario
			setTimeout(function (){
				$.Event.trigger($.Event.eventTypes.synchronusSuite);
			}, 0);

		}

	};

}(jsUnityRunner));