var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){

	// Register Events
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncSuite, function (){
		jsUnityRunner.API.asyncSuite();
	});
	
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncTest, function (){
		jsUnityRunner.API.asyncTest();
	});

	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncSetUp, function (){
		jsUnityRunner.API.asyncSetUp();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncTestRun, function (){
		jsUnityRunner.API.asyncTestRun();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncTearDown, function (){
		jsUnityRunner.API.asyncTearDown();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.asyncProceedToNext, function (){
		jsUnityRunner.API.asyncProceedToNext();
	});

	// Override API
	jsUnity.run = jsUnityRunner.API.run;

	jsUnityRunner.Runner.loadTests();
	
	jsUnity.error = function (eStr){
		jsUnityRunner.Logger.error(eStr);
	};
	
	jsUnity.log = function (eStr){
		jsUnityRunner.Logger.log(eStr);
	};
	
});
