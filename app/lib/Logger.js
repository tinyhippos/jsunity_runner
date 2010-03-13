// ----------------- Error/Log handling ----------------- \\
(jsUnityRunner.Logger = function ($){
	
    return {

        verbose: false,

        warn: function (msg){
			if(this.verbose){
				document.getElementById($.Constants.INFO_LOGGER_DIV).innerHTML += msg + "<br />";
			}
        },

        log: function (msg, colour){
			colour = colour || "#000000";
			document.getElementById($.Constants.LOGGER_DIV).innerHTML += '<span style="color:' + colour + ';">' + msg + "</span><br />";
        },

		error: function (msg){
			this.log(msg, "red");
			if(console){ console.error(msg); }
		},

        clear: function (){
            document.getElementById($.Constants.LOGGER_DIV).innerHTML = "";
            document.getElementById($.Constants.INFO_LOGGER_DIV).innerHTML = "";
        }
		
    };
    
}(jsUnityRunner));