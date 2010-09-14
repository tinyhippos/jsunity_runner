// ----------------- Runner ----------------- \\

(jsUnityRunner.Runner = function ($){

    var _suites,
            _markup,
            _results = {
                "totalTests": 0,
                "completedTests": 0,
                "failedTests": 0,
                "passedTests": 0
            },
            _progress_failed = false,
            _startTime,
            _timeStamp = new Date().getTime(),
            _category = undefined;

    function _countTests(suiteArray){
        var count = 0;

        $.Utils.forEach(suiteArray, function(index, suite){
            if (_category === "all" || (_category && suite.category === _category)) {
                $.Utils.forEach(suite, function(testName, testFunc){
                    if(testName.match(/^test/)){
                        count++;
                    }
                });
            }
        });

        return count;
    }

    function _compileSuitesToArray(){
        var temp = [];

        $.Utils.forEach(_suites, function (index, suite){
            if (_category === "all" || _category === suite.category) {
                temp.push(suite);
            }
        });

        return temp;
    }

    return {

        initialize: function () {

            this.ajaxLoader(true);

            this.registerEvents();

            this.getTestMarkup(function () {
                $.Runner.getTestFiles();
            });
        },

        // Public Methods
        run: function (suiteToRun, category, verbose){

            try{

                _category = category;

                this.loading(true);

                document.getElementById($.Constants.MARKUP_DIV).innerHTML = _markup;

                _progress_failed = false;

                this.reset();

                $.Logger.verbose = verbose || false;

                if(suiteToRun === "all"){
                    // TODO: figure out way to do this only once per load and not every run
                    _results.totalTests = _countTests(_suites);
                    _startTime = new Date().getTime();
                    jsUnity.run.apply(jsUnity, _compileSuitesToArray());
                }
                else{
                    if(!_suites[suiteToRun]){
                        $.Exception.raise($.Exception.types.TestSuite, "Uknown test suite, can not run Test Suite(s).");
                    }else{
                        _results.totalTests = _countTests( [_suites[suiteToRun]] );
                        _startTime = new Date().getTime();
                        jsUnity.run(_suites[suiteToRun]);
                    }
                }

            }
            catch(e){
                $.Logger.log(e);
                $.Exception.handle(e);
            }

        },

        // TODO: DRY!
        getTestMarkup: function (callback){

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (){

                if(this.readyState === 4) {

                    try{

                        _markup = this.responseText;

                        typeof callback === "function" && callback();

                    }
                    catch(e){
                        $.Logger.log(e);
                        $.Exception.handle(e);
                    }

                }

            };

            xhr.open("GET", $.Config.markupFile + "?" + _timeStamp, true);

            xhr.send(null);

        },

        ajaxLoader: function(open) {
            var loaderDiv = jQuery(".runner_loader");
            if (open) {
                loaderDiv.removeClass("irrelevant");
            }
            else {
                loaderDiv.addClass("irrelevant");
            }
        },

        loadScript: function(node, scriptSrc) {

            node.appendChild($.Utils.createElement("script", {
                "type": "text/javascript",
                "src": scriptSrc + "?" + _timeStamp
            }));

        },

        loadStylesheet: function(node, styleSheetSrc) {

            node.appendChild($.Utils.createElement("link", {
                "type": "text/css",
                "rel": "stylesheet",
                "src": styleSheetSrc + "?" + _timeStamp
            }));

        },

        getTestFiles: function (callback){

            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function (){

                if(this.readyState === 4) {

                    try{
                        $.Runner.injectFiles(window.JSON.parse(this.responseText));
                    }
                    catch(e){
                        $.Logger.log(e);
                        $.Exception.handle(e);
                    }

                }

            };

            xhr.open("GET", $.Config.testsFile + "?" + _timeStamp, true);

            xhr.send(null);

        },

        injectFiles: function(testObject) {

            var head = document.getElementsByTagName("head")[0];

            $.Utils.forEach(testObject.styles, function(index, styleSheet){
                $.Runner.loadStylesheet(head, styleSheet);
            });

            function inject(array, callback) {

                var index = 0,
                    intervalId;

                intervalId = window.setInterval(function(){

                    if (index < array.length) {
                        $.Runner.loadScript(head, array[index]);
                        index++;
                    }
                    else {
                        window.clearInterval(intervalId);
                        if (typeof callback === "function") {
                            callback();
                        }
                    }

                }, $.Constants.ASYNC_LOAD_INTERVAL);

            }

            // load these first
            if (testObject.scripts) {
                inject(testObject.scripts, function(){
                    if (testObject.tests) {
                        inject(testObject.tests, function() {
                            _suites = $.Tests;
                            window.setTimeout(function() {
                                $.Runner.loadTestSuitesIntoUI();
                                $.Runner.ajaxLoader(false);
                            }, $.Constants.ASYNC_LOAD_INTERVAL);
                        });
                    }
                });
            }
            else if (testObject.tests) {
                inject(testObject.tests, function() {
                    _suites = $.Tests;
                    window.setTimeout(function() {
                        $.Runner.loadTestSuitesIntoUI();
                        $.Runner.ajaxLoader(false);
                    }, $.Constants.ASYNC_LOAD_INTERVAL);
                });
            }
            else {
                this.ajaxLoader(false);
            }

        },

        stop: function (){
            $.API.terminate();
            this.loading(false);
        },

        resume: function (){
            this.loading(true);
            $.API.resume();
        },

        registerEvents: function(){

            $.Event.on($.Event.eventTypes.ApplicationState, function(){

                var runnerVerbose = $.Utils.id($.Constants.RUNNER_VERBOSE_CHECKBOX),
                    selectedTest = $.Utils.id($.Constants.RUNNER_SELECTOR),
                    selectedCategory = $.Utils.id($.Constants.RUNNER_CATEGORY_SELECTOR);

                if(!runnerVerbose){ $.Exception.raise($.Exception.type.DomObjectNotFound, $.Constants.RUNNER_VERBOSE_CHECKBOX + " was not found."); }
                if(!selectedTest){ $.Exception.raise($.Exception.type.DomObjectNotFound, $.Constants.RUNNER_SELECTOR + " was not found."); }
                if(!selectedCategory){ $.Exception.raise($.Exception.type.DomObjectNotFound, $.Constants.RUNNER_CATEGORY_SELECTOR + " was not found."); }

                $.Persistence.saveObject($.Constants.storage.ApplicationState, {
                    "verbose": runnerVerbose.checked,
                    "selectedTest": selectedTest.value,
                    "selectedCategory": selectedCategory.value
                });

            });

        },

        loading: function (startLoading){
            document.body.setAttribute("class", (startLoading ? "jsur_loading" : ""));
        },

        complete: function(){
            var endTime = (new Date().getTime() - _startTime);
            $.Utils.id($.Constants.RUNNER_STATUS_DIV).innerHTML = endTime + "ms elapsed ::";
            $.Logger.warn("<br />Completed Test Run! (" + endTime + " ms)");
            $.Event.trigger($.Event.eventTypes.ApplicationState);
            this.loading(false);
        },

        // TODO: do this method a lot better
        loadTestSuitesIntoUI: function (optionalCategory){

            var appState = $.Persistence.retrieveObject($.Constants.storage.ApplicationState) || null,
                categories = {},
                testSelector = $.Utils.id($.Constants.RUNNER_SELECTOR),
                categorySelector = $.Utils.id($.Constants.RUNNER_CATEGORY_SELECTOR),
                validCategory = false;

            _category = optionalCategory || (appState && appState.selectedCategory);

            testSelector.innerHTML = "";
            categorySelector.innerHTML = "";

            this.loadOption(testSelector, "all", "Run All Suites");
            this.loadOption(categorySelector, "all", "All Categories");

            // TODO: put into a UI class
            if(appState && appState.verbose){
                $.Utils.id($.Constants.RUNNER_VERBOSE_CHECKBOX).checked = true;
            }

            $.Utils.forEach($.Tests, function(index, suite){
                if (suite.category && !categories[suite.category]) {
                    categories[suite.category] = suite.category;

                    if (suite.category === _category) {
                        validCategory = true;
                    }
                }
            }, this);

            if (!validCategory) _category = "all";

            $.Utils.forEach($.Tests, function(index, suite){

                if (_category === "all" || _category === suite.category) {
                    this.loadOption(testSelector, index, suite.suiteName, (appState && appState.selectedTest));
                }

            }, this);

            $.Utils.forEach(categories, function(categoryType) {
                this.loadOption(categorySelector, categoryType, categoryType, _category);
            }, this);

        },

        loadOption: function (node, value, innerText, selectedValue){
            var el = $.Utils.createElement("option", {
                "value": value,
                "innerHTML":  innerText || "Uknown"
            });

            if(value === selectedValue){
                el.setAttribute("selected", "selected");
            }

            node.appendChild(el);
        },

        reset: function (){
            $.Utils.id($.Constants.PROGRESS_SCROLL).style.width = 0;
            $.Utils.id($.Constants.PROGRESS_DIV).innerHTML = "";
            $.Utils.id($.Constants.RUNNER_STATUS_DIV).innerHTML = "";
            $.Utils.id($.Constants.RUNNER_RESULTS_DIV).innerHTML = "";
            _results.totalTests = 0;
            _results.completedTests = 0;
            _results.failedTests = 0;
            _results.passedTests = 0;
            $.Logger.clear();
        },

        resetMarkup: function (){
            $.Utils.id($.Constants.MARKUP_DIV).innerHTML = _markup;
        },

        // updates progress.
        updateProgress: function (test){
            try{
                var str;

                if(test.failed){
                    _results.failedTests++;
                    _progress_failed = true;
                    $.Logger.log('[FAILED]  <span style="color: black">' + test.name + '</span><br />--> ' + test.messages.join("<br />--> "), "red");
                    //$.Logger.warn(test.name + " --> " + error);
                }
                else{
                    _results.passedTests++;
                    $.Logger.log('[PASSED]  <span style="color: black">' + test.name + "</span>", "green");
                }

                _results.completedTests++;
                $.Utils.id($.Constants.PROGRESS_DIV).innerHTML = _results.completedTests + " /" + _results.totalTests;
                $.Utils.id($.Constants.PROGRESS_SCROLL).style.width = ((_results.completedTests / _results.totalTests) * 100) + "%";
                $.Utils.id($.Constants.PROGRESS_SCROLL).style.backgroundColor = (_progress_failed ? "red" : "#40D940");

                str =  _results.passedTests + " passed :: " + _results.failedTests + " failed";
                $.Utils.id($.Constants.RUNNER_RESULTS_DIV).innerHTML = str;
            }
            catch(e){
                $.Exception.handle(e);
            }
        },

        notifySuiteStart: function (suite){

            if(suite.resetMarkup === true) {
                this.resetMarkup();
            }

            $.Logger.warn("<strong>Running " + (suite.suiteName || "unnamed test suite") + " :: " + suite.tests.length + " tests found</strong>");
            $.Logger.log("<strong>" + suite.suiteName + "</strong>");

        }

    };

}(jsUnityRunner));