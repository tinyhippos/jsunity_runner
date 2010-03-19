(jsUnityRunner.API = function ($){

	var _results = new jsUnity.TestResults(),
		_suites = [],
		_suiteNames = [],
		_asyncSuiteIndex,
		_asyncTestIndex,
		_startTime,
        _currentSuite,
        _currentTest,
        _shouldWait = false,
        _waitInterval = 5000,
        _assertWait = false;

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

    function _processsor(event, stopTime){

        if(_shouldWait && stopTime > (new Date()).getTime()){
            setTimeout(function() {
                _processsor(event, stopTime);
            }, 100);
        }
        else{

            if (_shouldWait) {
                $.Runner.failTest(_currentTest, "Test failed due to timeout!");
            }

            _shouldWait = false;
            setTimeout(function (){
				$.Event.trigger(event);
			}, 0);
        }

    }

	return {

        // override of jsUnity.run
        // returns the total amount of tests
        run: function(){

			var i;

			_asyncTestIndex = 0;
			_asyncSuiteIndex = 0;
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
				$.Event.trigger($.Event.eventTypes.asyncSuite);
			}, 0);

		},


        // API methods

        // makes the runner stop at whatever point in a test (setUp, test or tearDown) and wait until shouldWait is toggled again
        setWaitFlag: function(shouldWait, waitInterval){
            _shouldWait = shouldWait;
            _waitInterval = waitInterval || _waitInterval;
        },

        // tell the async wait routine to also wait for possible assertions in a callback
        setAssertWait: function(assertWait){
            _assertWait = assertWait;
        },

        asyncProcessor: function(callback, scope){
            
            $.Utils.validateArgumentType(callback, "function");

            try{
                
                callback.call(scope);

                $.Runner.passTest(_currentTest);
            }
            catch(e){

                $.Exception.handle(e);

                $.Runner.failTest(_currentTest, "Failed at TestRun with error: " + e);
            }

            _processsor($.Event.eventTypes.asyncTearDown, (new Date()).getTime());

        },


        // async methods
        // iterate over test suites to be run
		asyncSuite: function (){

			// "recursive" base case
			if(_asyncSuiteIndex < _suites.length){

				var suite = _suites[_asyncSuiteIndex],
				suiteLength = suite.tests.length;

				$.Runner.startSuite(suite, suiteLength, _plural(suiteLength, "test"));

				_suiteNames.push(suite.suiteName);

				_results.total += suiteLength;

				//$.Runner.updateAmountOfTests(suiteLength);

				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.asyncTest);
				}, 0);

			}else{
				_finalizeResults();
			}


        },

        // iterate through current test suite's tests
		asyncTest: function (){

            _currentSuite = _suites[_asyncSuiteIndex];
			_currentTest = _suites[_asyncSuiteIndex].tests[_asyncTestIndex];

            setTimeout(function (){
                $.Event.trigger($.Event.eventTypes.asyncSetUp);
            }, 0);
		},

        asyncSetUp: function(){
            try{
                if(_currentSuite.setUp()){
                    _currentSuite.setUp();
                }
                _processsor($.Event.eventTypes.asyncTestRun, (new Date()).getTime() + _waitInterval);
            }
            catch(e){
                $.Exception.handle(e);
                $.Runner.failTest(_currentTest, "Failed at SetUp with error: " + e);
                _processsor($.Event.eventTypes.asyncTearDown, (new Date()).getTime());
            }
        },

        asyncTestRun: function(){

            try{
				_currentTest.fn.call(_currentSuite.scope);

                // if im waiting then I should not go ahead to next step (wait for user callback to notify me)
                if (!_assertWait) {
                    _results.passed++;

                    $.Runner.passTest(_currentTest);

                    _processsor($.Event.eventTypes.asyncTearDown, (new Date()).getTime() + _waitInterval);
                }
            }
            catch(e){
                $.Exception.handle(e);
                $.Runner.failTest(_currentTest, "Failed at TestRun with error: " + e);
                _processsor($.Event.eventTypes.asyncTearDown, (new Date()).getTime());
            }

        },

        asyncTearDown: function(){
            try{
                if(_currentSuite.tearDown){
                    _currentSuite.tearDown();
                }
                _processsor($.Event.eventTypes.asyncProceedToNext, (new Date()).getTime() + _waitInterval);
            }
            catch(e){
                $.Exception.handle(e);
                $.Runner.failTest(_currentTest, "Failed at TearDown with error: " + e);
                _processsor($.Event.eventTypes.asyncProceedToNext, (new Date()).getTime());
            }
        },

        asyncProceedToNext: function() {
            _asyncTestIndex++;

			if(_asyncTestIndex < _currentSuite.tests.length){

				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.asyncTest);
				}, 0);

			}else{
				// all done, go to next Test Suite
				_asyncSuiteIndex++;
				_asyncTestIndex = 0;

				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.asyncSuite);
				}, 0);
			}
        }


	};

}(jsUnityRunner));