(jsUnityRunner.Tests.ExampleSuite =  function($j, $){

    return {

        suiteName: "-- Example Suite",

        setUp: function(){

        },

        tearDown: function(){

        },

        test_example: function(){
            $j.assertions.assertNotNull(1);
        },

        test_example_two: function(){
            $j.assertions.assertNull(null);
        }

    };

}(jsUnity, jsUnityRunner));
