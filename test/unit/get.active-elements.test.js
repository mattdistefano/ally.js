define(function(require) {
  'use strict';

  var bdd = require('intern!bdd');
  var expect = require('intern/chai!expect');
  var shadowInputFixture = require('../helper/fixtures/shadow-input.fixture');
  var getActiveElements = require('ally/get/active-elements');

  bdd.describe('get/active-element', function() {
    var fixture;

    bdd.before(function() {
      fixture = shadowInputFixture();
    });

    bdd.after(function() {
      fixture.remove();
      fixture = null;
    });

    bdd.describe('in document', function() {
      bdd.it('should return body/html when nothing is active', function() {
        var active = getActiveElements();
        expect(active.length).to.equal(1);

        // Internet Explorer 10 may think it's <html> rather than <body>
        if (active[0] === document.documentElement) {
          expect(active[0]).to.equal(document.documentElement);
        } else {
          expect(active[0]).to.equal(document.body);
        }
      });

      bdd.it('should return the activeElement', function() {
        fixture.input.outer.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(1);
        expect(active[0]).to.equal(document.activeElement);
      });
    });

    bdd.describe('in ShadowDOM', function() {
      bdd.before(function() {
        if (!fixture.shadow.first) {
          this.skip('Shadow DOM not supported');
        }
      });

      bdd.it('should return activeElement ancestry', function() {
        fixture.input.first.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(2);
        expect(active[0]).to.equal(fixture.input.first);
        expect(active[1]).to.equal(fixture.shadow.first);
      });

      bdd.it('should return activeElement ancestry for nested Shadows', function() {
        fixture.input.second.focus();
        var active = getActiveElements();
        expect(active.length).to.equal(3);
        expect(active[0]).to.equal(fixture.input.second);
        expect(active[1]).to.equal(fixture.shadow.second);
        expect(active[2]).to.equal(fixture.shadow.first);
      });
    });

  });
});
