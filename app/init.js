var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){

	// Register Events
	jsUnityRunner.API.registerEvents();
	jsUnityRunner.Runner.initialize();
	jsUnityRunner.UI.initialize();

	// Override API
    jsUnity.run = jsUnityRunner.API.run;
	
	jsUnity.error = function (eStr){
		jsUnityRunner.Logger.error(eStr);
	};
	
	jsUnity.log = function (eStr){
		jsUnityRunner.Logger.log(eStr);
	};
	
}, false);
