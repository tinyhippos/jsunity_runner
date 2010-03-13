var jsUnityRunner = function (){
	return {
		Tests: {}
	};
}();

// ----------------- Initializations ----------------- \\

window.addEventListener("load", function (){
	jsUnityRunner.Runner.loadTests();
});


jsUnity.error = function (eStr){
    jsUnityRunner.Logger.error(eStr);
}


jsUnity.log = function (eStr){
    jsUnityRunner.Logger.log(eStr);
}