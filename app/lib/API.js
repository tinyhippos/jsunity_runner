(jsUnityRunner.API = function ($){

	var _results = new jsUnity.TestResults(),
		_suites = [],
		_suiteNames = [],
		_synchronousSuiteIndex,
		_synchronousTestIndex,
		_startTime,
        _currentSuite,
        _currentTest,
        _currentTestFailed = false,
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
                // TODO: not really needed, need to do this better
                _currentTestFailed = true;
            }

            _shouldWait = false;
            setTimeout(function (){
				$.Event.trigger(event);
			}, 0);
        }

    }

	return {

        setWaitFlag: function(shouldWait, waitInterval){
            _shouldWait = shouldWait;
            _waitInterval = waitInterval || _waitInterval;
        },

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

        synchronousSetUp: function(){
            try{
                _currentSuite.setUp && _currentSuite.setUp();
                _processsor($.Event.eventTypes.synchronousTestRun, (new Date()).getTime() + _waitInterval);
            }
            catch(e){
                $.Exception.handle(e);
                $.Runner.failTest(_currentTest, "Failed at SetUp with error: " + e);
                _processsor($.Event.eventTypes.synchronousTearDown, (new Date()).getTime());
            }
        },

        synchronousTestRun: function(){
            try{
				_currentTest.fn.call(_currentSuite.scope);

                if (!_assertWait) {
                    _results.passed++;

                    if(!_currentTestFailed){
                        $.Runner.passTest(_currentTest);
                    }
                    _processsor($.Event.eventTypes.synchronousTearDown, (new Date()).getTime() + _waitInterval);
                }
            }
            catch(e){
                $.Exception.handle(e);
                $.Runner.failTest(_currentTest, "Failed at TestRun with error: " + e);
                _processsor($.Event.eventTypes.synchronousTearDown, (new Date()).getTime());
            }

        },

        synchronousTearDown: function(){
            try{
                _currentSuite.tearDown && _currentSuite.tearDown();
                _processsor($.Event.eventTypes.synchronousProceedToNext, (new Date()).getTime() + _waitInterval);
            }
            catch(e){
                $.Exception.handle(e);
                // TODO: not really needed, need to do this better
                _currentTestFailed = true;
                $.Runner.failTest(_currentTest, "Failed at TearDown with error: " + e);
                _processsor($.Event.eventTypes.synchronousProceedToNext, (new Date()).getTime());
            }
        },


        synchronousProceedToNext: function() {
 			_synchronousTestIndex++;

			if(_synchronousTestIndex < _currentSuite.tests.length){

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

        // iterate through current test suite's tests
		synchronousTest: function (){

            // TODO: a hack property (since logic currently can fail a test but have it logged as a pass directly after it (two logs))
            _currentTestFailed = false;

            _currentSuite = _suites[_synchronousSuiteIndex],
			_currentTest = _suites[_synchronousSuiteIndex].tests[_synchronousTestIndex];

            setTimeout(function (){
                $.Event.trigger($.Event.eventTypes.synchronousSetUp);
            }, 0);
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