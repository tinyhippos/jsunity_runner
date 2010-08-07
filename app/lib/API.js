(jsUnityRunner.API = function ($){

	var _suites = [],
		_asyncSuiteIndex,
		_asyncTestIndex,
		_currentSuite,
		_currentTest,
		_asyncProcessShouldWait = false,
		_defaultWaitInterval = 5000,
		_waitInterval = 5000,
		_assertCallbackWasCalled = false,
		_terminated = false,
		_resumeEvent;

	function _isJSUnityError(e){
		return (e.name && e.message) ? false : true;
	}

	function _processor(event, stopTime, errorMessage){
		
		if (_terminated) {
			(_resumeEvent = function (){
				_processor(event, stopTime, errorMessage);
			});
			return;
		}
		
		var now = (new Date()).getTime();

		if(_asyncProcessShouldWait && stopTime > now){

			setTimeout(function() {
                _processor(event, stopTime, errorMessage);
			}, 100);
		}
		else{

			// TODO: figure out logic to stop additional setTimeout fails when expecting a callback assert (with _assertCallbackWasCalled)
			if (_asyncProcessShouldWait) {
				_currentTest.failed = true;
				_currentTest.messages.push(errorMessage + "Test failed due to timeout!");
			}

			_asyncProcessShouldWait = false;
			_assertCallbackWasCalled = false;

			setTimeout(function (){
				$.Event.trigger(event);
			}, 0);

		}

	}

	function _applyToCurrentTest(callback, scope){
		$.Utils.validateArgumentType(callback, "function");

		try{
			callback.call(scope);
		}
		catch(e){

			if(!_isJSUnityError(e)){
				$.Exception.handle(e);
			}

			_currentTest.failed = true;
			_currentTest.messages.push("Failed at TestRun with error: " + e);

		}
	}

	return {

		// override of jsUnity.run
		run: function(){

			var i;

			_asyncTestIndex = 0;
			_asyncSuiteIndex = 0;
			_suites = [];
			_terminated = false;
			_resumeEvent = null;

			for (i = 0; i < arguments.length; i++) {
				// TODO: validate a Test Suite
				try {
					_suites.push(jsUnity.compile(arguments[i]));
				}
				catch (e) {
					if($.Console.isAvailable()) {
						$.Console.error("TestSuite exception :: " + e);
					}
					return false;
				}
			}

			// initiate asynchronous scenario
			setTimeout(function (){
				$.Event.trigger($.Event.eventTypes.asyncSuite);
			}, 0);

		},

		terminate: function (){
			if(!_terminated) {
				_terminated = true;
			}
		},

		resume: function (){
			if(_terminated) {
				_terminated = false;
				_resumeEvent.call(this);
			}
		},

		// API methods
		registerEvents: function(){

			var i,
				events = [
					$.Event.eventTypes.asyncSuite,
					$.Event.eventTypes.asyncTest,
					$.Event.eventTypes.asyncSetUp,
					$.Event.eventTypes.asyncTestRun,
					$.Event.eventTypes.asyncTearDown,
					$.Event.eventTypes.asyncProceedToNext
				],
				addEventCallback = function(event){
					return(function(){ $.API[event](); });
				};

			for (i = 0; i < events.length; i++) {
				$.Event.on(events[i], addEventCallback(events[i]));
			}

		},

		// makes the runner stop at whatever point in a test (setUp, test or tearDown) and loop in _processor
		startAsyncTest: function(waitInterval) {
			_asyncProcessShouldWait = true;
			_waitInterval = waitInterval || _waitInterval;
			$.Logger.warn(_currentTest.name + " <strong>(Begin Async Wait)</strong>");
		},

		endAsyncTest: function(callback, scope) {
			if(callback){
				_applyToCurrentTest(callback, scope);
				_assertCallbackWasCalled = true;
			}
			_asyncProcessShouldWait = false;
			_waitInterval = _defaultWaitInterval;
			$.Logger.warn(_currentTest.name + " <strong>(End Async Wait)</strong>");
		},

		// async methods
		// iterate over test suites to be run
		asyncSuite: function (){

			if(_currentSuite && _currentSuite.scope && _currentSuite.scope.tearDownSuite && typeof _currentSuite.scope.tearDownSuite === "function") {
				_currentSuite.scope.tearDownSuite.apply();
			}
			
			// "recursive" base case
			if(_asyncSuiteIndex < _suites.length){

				_currentSuite = _suites[_asyncSuiteIndex];

				if(_currentSuite && _currentSuite.setUpSuite && typeof _currentSuite.setUpSuite === "function") {
					_currentSuite.setUpSuite.apply();
				}

				$.Runner.notifySuiteStart(_currentSuite);

				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.asyncTest);
				}, 0);

			}
			else{
				$.Runner.complete();
			}

		},

		asyncTest: function (){
			
			_currentTest = _suites[_asyncSuiteIndex].tests[_asyncTestIndex];
			_currentTest.messages = [];
			_currentTest.failed = false;

			setTimeout(function (){
				$.Event.trigger($.Event.eventTypes.asyncSetUp);
			}, 0);
		},

		asyncSetUp: function(){
			this.asyncSuiteStep(_currentSuite.setUp, null, null, $.Event.eventTypes.asyncTestRun, "SetUp");
		},

		asyncTestRun: function(){
			this.asyncSuiteStep(_currentTest.fn, null, _currentSuite.scope, $.Event.eventTypes.asyncTearDown, "TestRun");
		},

		asyncTearDown: function(){
			this.asyncSuiteStep(_currentSuite.tearDown, null, null, $.Event.eventTypes.asyncProceedToNext, "TearDown");
		},

		asyncSuiteStep: function (method, args, scope, nextEvent, currentEvent){
			var timestamp = new Date().getTime();
			try{
				if(method && typeof method === "function"){
					method.apply(scope, args);
				}
				_processor(nextEvent, timestamp + _waitInterval, "Failed at " + currentEvent + " :: ");
			}
			catch(e){
				if(!_isJSUnityError(e)){
					$.Exception.handle(e);
				}

				_currentTest.failed = true;
				_currentTest.messages.push("Failed at " + currentEvent + " with error: " + e);

				_processor(nextEvent, timestamp, "Failed at " + currentEvent + " :: ");
			}
		},

		asyncProceedToNext: function() {

			$.Runner.updateProgress(_currentTest);

			_asyncTestIndex++;

			if(_asyncTestIndex < _currentSuite.tests.length){

				setTimeout(function (){
					$.Event.trigger($.Event.eventTypes.asyncTest);
				}, 0);

			}
			else{
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