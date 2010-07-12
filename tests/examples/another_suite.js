(jsUnityRunner.Tests.AnotherSuite = function($j, $){

    return {

        suiteName: "-- Another Suite",

        category: "General", 

        resetMarkup: true,

        setUp: function(){

        },

        tearDown: function(){

        },

        test_example: function(){
            $j.assertions.assertNotNull(1);
        },

        test_example_two: function(){
            $j.assertions.assertNotNull(null);
        }

    };

}(jsUnity, jsUnityRunner));
