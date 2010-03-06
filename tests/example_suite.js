(jsUnityWrapper.Tests.ExampleSuite = function($){

    return {
        
        suiteName: "-- Example Suite",

        setUp: function(){
            
        },
        
        tearDown: function(){
            
        },

        test_example: function(){
            $.assertions.assertNotNull(1);
        },

        test_example_two: function(){
            $.assertions.assertNotNull(null);
        }
    };

}(jsUnity));
