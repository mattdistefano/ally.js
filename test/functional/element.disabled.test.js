define(function(require) {
  'use strict';

  var bdd = require('intern!bdd');
  var keys = require('intern/dojo/node!leadfoot/keys');
  var pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');
  require('../helper/leadfoot-commands');

  bdd.describe('element/disabled', function() {
    var timeout = 120000;

    bdd.before(function() {
      return this.remote
        .skipUnlessCapability(this, 'shiftFocusOnTab', 'Cannot test Tab focus via WebDriver in this browser')
        .setTimeouts(timeout)

        .get(require.toUrl('test/pages/element.disabled.test.html'))
        // wait until we're really initialized
        .then(pollUntil('return window.platform'));
    });

    bdd.it('should skip disabled elements', function() {
      this.timeout = timeout;

      return this.remote
        .focusById('before')
        .expectActiveElement('before', 'initial position')

        .pressKeys(keys.TAB)
        .expectActiveElement('after', 'after first Tab');
    });
  });
});
