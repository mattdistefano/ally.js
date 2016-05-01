define(function(require) {
  'use strict';

  var bdd = require('intern!bdd');
  var expect = require('intern/chai!expect');
  var TestWorker = require('../helper/test-worker');

  bdd.describe('core: loading in Worker', function() {
    var worker;

    // because all files are loaded in the same worker,
    // we'll load the ones with the fewest dependencies first,
    // so we don't hit timeouts caused by slow networks or VMs
    var modules = [
      'ally.js/event/active-element',
      'ally.js/event/shadow-focus',
      'ally.js/prototype/element.prototype.matches',
      'ally.js/prototype/window.customevent',
      'ally.js/util/context-to-element',
      'ally.js/util/decorate-context',
      'ally.js/util/decorate-service',
      'ally.js/util/merge-dom-order',
      'ally.js/util/node-array',
      'ally.js/util/tabindex-value',
      'ally.js/util/visible-area',
      'ally.js/is/disabled',
      'ally.js/is/active-element',
      'ally.js/is/focus-relevant',
      'ally.js/is/focusable',
      'ally.js/is/native-disabled-supported',
      'ally.js/is/only-tabbable',
      'ally.js/is/shadowed',
      'ally.js/is/tabbable',
      'ally.js/is/valid-area',
      'ally.js/is/valid-tabindex',
      'ally.js/is/visible',
      'ally.js/get/active-elements',
      'ally.js/get/focus-redirect-target',
      'ally.js/get/focus-target',
      'ally.js/get/insignificant-branches',
      'ally.js/get/parents',
      'ally.js/get/shadow-host-parents',
      'ally.js/get/shadow-host',
      'ally.js/element/blur',
      'ally.js/element/disabled',
      'ally.js/element/focus',
      'ally.js/observe/interaction-type',
      'ally.js/observe/shadow-mutations',
      'ally.js/query/first-tabbable',
      'ally.js/query/focusable',
      'ally.js/query/shadow-hosts',
      'ally.js/query/tabbable',
      'ally.js/query/tabsequence.sort-area',
      'ally.js/query/tabsequence.sort-tabindex',
      'ally.js/query/tabsequence',
      'ally.js/style/focus-within',
      'ally.js/style/focus-source',
      'ally.js/when/focusable',
      'ally.js/when/key',
      'ally.js/when/visible-area',
      'ally.js/version',
      'ally.js/fix/pointer-focus-children',
      'ally.js/fix/pointer-focus-input',
      'ally.js/fix/pointer-focus-parent',
      'ally.js/maintain/disabled',
      'ally.js/maintain/hidden',
      'ally.js/maintain/tab-focus',
      'ally.js/ally',
    ];

    bdd.before(function() {
      if (!TestWorker) {
        this.skip('Worker not supported');
      }

      worker = new TestWorker();
    });

    bdd.after(function() {
      worker && worker.terminate();
      worker = null;
    });

    bdd.describe('for individual modules', function() {
      modules.forEach(function(module) {
        bdd.it('should load ' + module, function() {
          var deferred = this.async(30000);

          worker.run(module, function(_module) {
            // we only care about the existence
            return Boolean(_module);
          }).test(deferred, function(_module) {
            expect(_module).to.equal(true);
          });
        });
      });
    });

    bdd.describe('for bundle', function() {
      bdd.it('should load dist/ally.min.js', function() {
        var deferred = this.async(30000);

        worker.run('../../dist/ally.min.js', function(_module) {
          return _module.version;
        }).test(deferred, function(_module) {
          expect(_module).to.be.a('string');
        });
      });
    });

  });
});
