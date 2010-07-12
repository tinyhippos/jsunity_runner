// ----------------- Utils ----------------- \\
(jsUnityRunner.UI = function ($){

	return {
		
		initialize: function (){

			var runner_selector = jQuery("#" + $.Constants.RUNNER_SELECTOR),
				runner_verbose = jQuery("#" + $.Constants.RUNNER_VERBOSE_CHECKBOX),
				runner_category_selector = jQuery("#" + $.Constants.RUNNER_CATEGORY_SELECTOR);

			// DOM Events

            runner_category_selector.bind("change", function() {
                // TODO: hmmm.
                $.Event.trigger($.Event.eventTypes.ApplicationState);                
                $.Runner.loadTestSuitesIntoUI(runner_category_selector.val());
            });

			jQuery("#runner_submit").bind("click", function (){
				$.Runner.run(runner_selector.val(), runner_category_selector.val(), runner_verbose.val());
			});

			jQuery("#runner_reload").bind("click", function (){
				location.reload();
			});

			jQuery("#runner_clear").bind("click", function (){
				$.Logger.clear();
			});

			jQuery("#runner_stop").bind("click", function (){
				$.Runner.stop();
			});

			jQuery("#runner_resume").bind("click", function (){
				$.Runner.resume();
			});
			
			runner_verbose.bind("click", function(){
				$.Event.trigger($.Event.eventTypes.ApplicationState);
			});

			runner_selector.bind("change", function(){
				$.Event.trigger($.Event.eventTypes.ApplicationState);
			});
		}
		
	};
    
}(jsUnityRunner));