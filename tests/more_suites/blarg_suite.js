(jsUnityRunner.Tests.BlargSuite =  function($j, $){

    return {
        
        suiteName: "-- More Suites :: Blarg Suite",

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
