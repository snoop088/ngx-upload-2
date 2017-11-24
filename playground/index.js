"use strict";
exports.__esModule = true;
/**
 * This is only for local test
 */
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
// import { SampleModule }  from 'ngx-upload-2';
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent.decorators = [
        { type: core_2.Component, args: [{
                    selector: 'app',
                    template: "<sample-component></sample-component>"
                },] },
    ];
    /** @nocollapse */
    AppComponent.ctorParameters = function () { return []; };
    return AppComponent;
}());
var AppModule = (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: core_1.NgModule, args: [{
                    bootstrap: [AppComponent],
                    declarations: [AppComponent],
                    imports: [platform_browser_1.BrowserModule]
                },] },
    ];
    /** @nocollapse */
    AppModule.ctorParameters = function () { return []; };
    return AppModule;
}());
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(AppModule);
