var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){

	// Register Events
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousSuite, function (){
		jsUnityRunner.API.synchronousSuite();
	});
	
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousTest, function (){
		jsUnityRunner.API.synchronousTest();
	});

	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousSetUp, function (){
		jsUnityRunner.API.synchronousSetUp();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousTestRun, function (){
		jsUnityRunner.API.synchronousTestRun();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousTearDown, function (){
		jsUnityRunner.API.synchronousTearDown();
	});

    jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronousProceedToNext, function (){
		jsUnityRunner.API.synchronousProceedToNext();
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
