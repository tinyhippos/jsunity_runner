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
