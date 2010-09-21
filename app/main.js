var jsUnityRunner = (function (){
    return {
        Tests: {}
    };
}());

$LAB.setGlobalDefaults({
    "AlwaysPreserveOrder": true, 
    "UseCachePreload": false,
    "UsePreloading": false,
    "UseLocalXHR": false
});

$LAB.script("app/config.js")
    .script("app/thirdparty/jsunity-0.6.js")
    .script("app/thirdparty/jquery1.4.2.min.js")
    .script("app/lib/API.js")
    .script("app/lib/Copy.js")
    .script("app/lib/Persistence.js")
    .script("app/lib/Constants.js")
    .script("app/lib/Event.js")
    .script("app/lib/Console.js")
    .script("app/lib/Runner.js")
    .script("app/lib/Logger.js")
    .script("app/lib/Exception.js")
    .script("app/lib/UnitTestHelpers.js")
    .script("app/lib/Utils.js")
    .script("app/lib/UI.js")
    .script("app/init.js");
