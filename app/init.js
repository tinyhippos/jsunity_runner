var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){

	// Register Events
	jsUnityRunner.API.registerEvents();
	jsUnityRunner.Runner.registerEvents();

    // DOM Events
    $("#" + jsUnityRunner.Constants.RUNNER_VERBOSE_CHECKBOX).click(function(){
        jsUnityRunner.Event.trigger(jsUnityRunner.Event.eventTypes.ApplicationState);
    });

    $("#" + jsUnityRunner.Constants.RUNNER_SELECTOR).change(function(){
        jsUnityRunner.Event.trigger(jsUnityRunner.Event.eventTypes.ApplicationState);
    });

	// Override API
	jsUnity.run = jsUnityRunner.API.run;

	jsUnityRunner.Runner.loadTestSuites();
	
	jsUnity.error = function (eStr){
		jsUnityRunner.Logger.error(eStr);
	};
	
	jsUnity.log = function (eStr){
		jsUnityRunner.Logger.log(eStr);
	};
	
}, false);
