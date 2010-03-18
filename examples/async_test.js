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
                    if (xmlHttp.status === 200){
                        if (xmlHttp.responseXML) {
                            _configXML = xmlHttp.responseXML;
                            $.API.setWaitFlag(false);
                        }
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
        }
    }
}(jsUnity, jsUnityRunner));