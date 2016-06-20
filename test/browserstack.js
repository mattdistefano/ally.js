define(function(require) {
  'use strict';

  var config = require('./intern');

  config.capabilities = {
    project: 'ally.js',
    // 'browserstack.debug': true,
    // 'browserstack.video': true,
    // 'browserstack.ie.noFlash': true,

    // prevent download popup in chrome
    chromeOptions: {
      args: ['--multiple-automatic-downloads=1'],
    },
  };

  // https://theintern.github.io/intern/#option-environments
  // see https://www.browserstack.com/automate/capabilities
  /*eslint-disable camelcase */
  config.environments = [
    { browser: 'IE', browser_version: '11', os: 'WINDOWS', os_version: '8.1', platform: 'WIN', browserName: 'IE11' },
    { browser: 'IE', browser_version: '10', os: 'WINDOWS', os_version: '8', platform: 'WIN', browserName: 'IE10', nativeEvents: true },
  ];
  /*eslint-enable camelcase */

  // https://theintern.github.io/intern/#option-maxConcurrency
  // OpenSauce allows 5 concurrent VMs
  //config.maxConcurrency = 5;
  config.maxConcurrency = 2;
  // https://theintern.github.io/intern/#option-tunnel
  config.tunnel = 'BrowserStackTunnel';
  config.tunnelOptions = {
    hostname: 'hub.browserstack.com',
    protocol: 'https',
    port: 443,
  };

  return config;
});
