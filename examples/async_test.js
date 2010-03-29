(jsUnityRunner.Tests.AsyncTest =  function($j, $){
    var _configXML = null;

    return {

        suiteName: "-- Async Suite",

        setUp: function(){

            $.API.setWaitFlag(true);

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function() {
                var configContentDiv;

                if (xmlHttp.readyState === 4) {
                        if (xmlHttp.responseXML) {
                            _configXML = xmlHttp.responseXML;
                            $.API.setWaitFlag(false);
                    }
                }
            };

            xmlHttp.open("GET", "examples/config.xml", true);

            xmlHttp.send(null);
        },

        tearDown: function(){
            
        },

        test_test_that_setUp_waited_properly: function(){
            $j.assertions.assertNotNull(_configXML);
        },


        test_async_test_waits_for_callback_to_complete: function(){

            $.API.setWaitFlag(true);

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function() {

                if (xmlHttp.readyState === 4) {
                    $.API.setWaitFlag(false);
                }
            };

            xmlHttp.open("GET", "examples/config.xml", true);

            xmlHttp.send(null);

        },

        test_async_test_waits_for_callback_to_complete_and_fails: function(){

            $.API.startAsyncTest();

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function() {

                if (xmlHttp.readyState === 4) {

                    $.API.endAsyncTest();
                    $.API.asyncProcessor(function(){
                        $j.assertions.fail("FAILED PROPERLY!");
                    }, this);
                }
            };

            xmlHttp.open("GET", "examples/config.xml", true);

            xmlHttp.send(null);

        },

        test_async_test_can_parse_xml_doc: function(){

            $.API.startAsyncTest();

            var xmlHttp = new XMLHttpRequest();

            xmlHttp.onreadystatechange = function() {
                var xmlDoc;

                if (xmlHttp.readyState === 4) {
                    $.API.endAsyncTest();

                    xmlDoc = xmlHttp.responseXML;
                    $.API.asyncProcessor(function() {
                        var nodes;
                        var oEvaluator = new XPathEvaluator();
                        nodes = oEvaluator.evaluate("//widget", xmlDoc, null, XPathResult.ANY_TYPE, null);

                        node = nodes.iterateNext();
                        console.log(node);
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