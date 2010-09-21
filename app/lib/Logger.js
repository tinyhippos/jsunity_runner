// ----------------- Error/Log handling ----------------- \\
(jsUnityRunner.Logger = function ($){
	
	return {

		verbose: false,

		warn: function (msg){
			if(this.verbose && $.Console.isAvailable()){
				$.Console.warn("JSUR :: " + msg.replace(/<br \/>/, "\n"));
			}
		},

		log: function (msg, colour){
			var d = $.Utils.id($.Constants.LOGGER_DIV);
			colour = colour || "#000000";
			d.innerHTML += '<span style="color:' + colour + ';">' + msg + "</span><br />";
			d.scrollTop = d.scrollHeight;
		},

		error: function (msg){
			this.log(msg, "red");
			if($.Console.isAvailable()){ $.Console.error(msg); }
		},

		clear: function (){
			$.Utils.id($.Constants.LOGGER_DIV).innerHTML = "";
		}

	};
    
}(jsUnityRunner));