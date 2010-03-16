var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){

	// Register Events
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronusSuite, function (){
		jsUnityRunner.API.synchronusSuite();
	});
	
	jsUnityRunner.Event.on(jsUnityRunner.Event.eventTypes.synchronusTest, function (){
		jsUnityRunner.API.synchronusTest();
	});

	// Override API
	jsUnity.run = jsUnityRunner.API.run;

	jsUnityRunner.Runner.loadTests();
	
	jsUnity.error = function (eStr){
		jsUnityRunner.Logger.error(eStr);
	}
	
	jsUnity.log = function (eStr){
		jsUnityRunner.Logger.log(eStr);
	}
	
});
