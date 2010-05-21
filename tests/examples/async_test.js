(jsUnityRunner.Tests.AsyncTest =  function($j, $){
    var _setUpConfigXML = null,
        _tearDownConfigXML = null;

    function _makeTestRequest(callback){

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = callback;

        xmlHttp.open("GET", "tests/examples/config.xml", true);

        xmlHttp.send(null);
    }

    return {
        
        suiteName: "-- Async Suite",

        setUp: function(){
            $.API.startAsyncTest();

            _makeTestRequest(function() {

                var configContentDiv;

                if (this.readyState === 4) {
                    if (this.responseXML) {
                        _setUpConfigXML = this.responseXML;
                        $.API.endAsyncTest();
                    }
                }

            });

            //dude();

        },

        tearDown: function(){
            $.API.startAsyncTest();

            _makeTestRequest(function() {

                var configContentDiv;

                if (this.readyState === 4) {
                    if (this.responseXML) {
                        _tearDownConfigXML = this.responseXML;
                        $.API.endAsyncTest();
                    }
                }

            });

            //dude();
        },

        test_test_that_setUp_waited_properly: function(){
            $j.assertions.assertNotNull(_setUpConfigXML);
        },

        test_test_that_tearDown_waited_properly: function(){
            $j.assertions.assertNotNull(_tearDownConfigXML);
        },


        test_async_test_waits_for_async_callback_toto_notify_runner_and_complete: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {
                    $.API.endAsyncTest();
                }

            });

        },

        test_async_test_waits_for_async_callback_to_complete_and_asserts_a_fail_on_async: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {

                    $.API.endAsyncTest(function(){
                        $j.assertions.fail("FAILED on Async Callback!");
                    }, this);
                }
            });

        },

        test_async_test_fails_due_to_timeout_when_async_callback_fails_to_notify_runner: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {

                }
            });

        },

        test_async_test_fails_due_to_timeout_when_async_callback_fails_to_notify_runner_AND_test_throws_exception: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {

                }

            });

            dude();

        },

        test_async_test_fails_when_async_callback_notifies_runner_AND_test_throws_exception: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {
                    $.API.endAsyncTest();
                }
            });

            dude();

        },

        test_async_test_fails_when_async_callback_notifies_runner_AND_test_throws_exception_AND_asserts_on_async: function(){

            $.API.startAsyncTest();

            _makeTestRequest(function() {

                if (this.readyState === 4) {

                    $.API.endAsyncTest(function(){
                        $j.assertions.fail("FAILED on Async Callback!");
                    }, this);
                }
            });

            dude();

        },

        test_async_test_can_parse_xml_doc: function(){

            $.API.startAsyncTest();

            var xmlHttp = new XMLHttpRequest(),
            	nodes,
            	oEvaluator;

            xmlHttp.onreadystatechange = function() {

                if (xmlHttp.readyState === 4) {

                    $.API.endAsyncTest(function() {

                        oEvaluator = new XPathEvaluator();
                        	
                        nodes = oEvaluator.evaluate("//widget", xmlHttp.responseXML, null, XPathResult.ANY_TYPE, null);

                        node = nodes.iterateNext();

                        $j.assertions.assertTypeOf("object", nodes);
                    }, this);
                }
                
            };

            xmlHttp.open("GET", "examples/config.xml", true);

            xmlHttp.send(null);

        },

        test_a_test_after_async_tests: function(){
            $j.assertions.assertNull(null);
        },

        test_a_test_after_async_tests_again: function(){
            $j.assertions.assertNull(null);
        }
        
    }
}(jsUnity, jsUnityRunner));