Error.stackTraceLimit = Infinity;

require('core-js');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/zone-patch-rxjs-fake-async');
require('rxjs');

require('jquery');

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
    browser.BrowserDynamicTestingModule,
    browser.platformBrowserDynamicTesting()
);

function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

const testContext = require.context('./src', true, /\.spec\.ts$/);
requireAll(testContext);