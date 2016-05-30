define(function(require) {
  'use strict';

  var bdd = require('intern!bdd');
  var expect = require('intern/chai!expect');
  var focusableFixture = require('../helper/fixtures/focusable.fixture');
  var supports = require('../helper/supports');
  var isFocusable = require('ally/is/focusable');

  bdd.describe('is/focusable', function() {
    var fixture;

    bdd.before(function() {
      var deferred = this.async(10000);
      fixture = focusableFixture();
      // NOTE: Firefox decodes DataURIs asynchronously
      setTimeout(deferred.resolve, 200);
    });

    bdd.after(function() {
      fixture.remove();
      fixture = null;
    });

    bdd.it('should handle invalid input', function() {
      expect(function() {
        isFocusable(null);
      }).to.throw(TypeError, 'is/focusable requires valid options.context');

      expect(function() {
        isFocusable([true]);
      }).to.throw(TypeError, 'is/focusable requires options.context to be an Element');
    });

    bdd.it('should provide .rules() and .except()', function() {
      var element = document.getElementById('inert-div');
      expect(isFocusable.rules({
        context: element,
      })).to.equal(false, '.rules()');

      expect(isFocusable.rules.except({})(element)).to.equal(false, '.rules.except()');
    });

    bdd.describe('for document structure', function() {
      bdd.it('should return false for document', function() {
        expect(isFocusable(document)).to.equal(false);
      });

      bdd.it('should return false for <html>', function() {
        expect(isFocusable(document.documentElement)).to.equal(false);
      });

      bdd.it('should return false for <body>', function() {
        expect(isFocusable(document.body)).to.equal(false);
      });

      bdd.it('should return false for <head>', function() {
        expect(isFocusable(document.head)).to.equal(false);
      });
    });

    bdd.describe('for <div> with tabindex attribute', function() {
      bdd.it('should return false for <div>', function() {
        var element = document.getElementById('inert-div');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return true for <div tabindex="-1">', function() {
        var element = document.getElementById('tabindex--1');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return true for <div tabindex="0">', function() {
        var element = document.getElementById('tabindex-0');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return true for <div tabindex="1">', function() {
        var element = document.getElementById('tabindex-1');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return {browser-specific} for <div tabindex="bad">', function() {
        var element = document.getElementById('tabindex-bad');
        expect(isFocusable(element)).to.equal(supports.canFocusInvalidTabindex);
      });
    });

    bdd.describe('for <a>', function() {
      bdd.it('should return false for <a> (without href attribute)', function() {
        var element = document.getElementById('anchor');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return true for <a href="…">', function() {
        var element = document.getElementById('link');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return true for <a tabindex="-1">', function() {
        var element = document.getElementById('link-tabindex--1');
        expect(isFocusable(element)).to.equal(true);
      });
    });

    bdd.describe('for <input>', function() {
      bdd.it('should return true for <input>', function() {
        var element = document.getElementById('input');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return true for <input tabindex="-1">', function() {
        var element = document.getElementById('input-tabindex--1');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return false for <input disabled>', function() {
        var element = document.getElementById('input-disabled');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return false for <fieldset disabled> <input>', function() {
        var element = document.getElementById('fieldset-disabled-input');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return false for <input type="hidden">', function() {
        var element = document.getElementById('input-hidden');
        expect(isFocusable(element)).to.equal(false);
      });
    });

    bdd.describe('for editable elements', function() {
      bdd.it('should return true for <span contenteditable>', function() {
        var element = document.getElementById('span-contenteditable');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return {browser-specific} for <span style="user-modify: read-write">', function() {
        var _supports = document.body.style.webkitUserModify !== undefined;
        var element = document.getElementById('span-user-modify');
        expect(isFocusable(element)).to.equal(_supports);
      });
    });

    bdd.describe('for <img>', function() {
      bdd.it('should return false for <img usemap="…">', function() {
        var element = document.getElementById('img-usemap');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return {browser-specific} for <img usemap="…" tabindex="-1">', function() {
        var element = document.getElementById('img-usemap');
        element.setAttribute('tabindex', '-1');
        expect(isFocusable(element)).to.equal(supports.canFocusImgUsemapTabindex);
      });

      bdd.it('should return {browser-specific} for <a> <img ismap>', function() {
        var element = document.getElementById('img-ismap');
        expect(isFocusable(element)).to.equal(supports.canFocusImgIsmap);
      });
    });

    bdd.describe('for <area>', function() {
      bdd.it('should return true for <area>', function() {
        var element = document.getElementById('image-map-area');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return {browser-specific} for <area tabindex="-1">', function() {
        var element = document.getElementById('image-map-area');
        element.setAttribute('tabindex', '-1');
        expect(isFocusable(element)).to.equal(supports.canFocusAreaTabindex);
      });
    });

    bdd.describe('for <label>', function() {
      bdd.it('should return false for <label>', function() {
        var element = document.getElementById('label');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return {browser-specific} for <label tabindex="-1">', function() {
        var element = document.getElementById('label');
        element.setAttribute('tabindex', '-1');
        expect(isFocusable(element)).to.equal(supports.canFocusLabelTabindex);
      });

      bdd.it('should return {browser-specific} for <label tabindex="0">', function() {
        var element = document.getElementById('label');
        element.setAttribute('tabindex', '0');
        expect(isFocusable(element)).to.equal(supports.canFocusLabelTabindex);
      });
    });

    bdd.describe('for <audio>', function() {
      bdd.it('should return true for <audio controls>', function() {
        var element = document.getElementById('audio-controls');
        expect(isFocusable(element)).to.equal(true);
      });

      bdd.it('should return {browser-specific} for <audio> without controls attribute', function() {
        var element = document.getElementById('audio');
        expect(isFocusable(element)).to.equal(supports.canFocusAudioWithoutControls);
      });
    });

    bdd.describe('for SVG', function() {
      bdd.it('should return {browser-specific} for <svg>', function() {
        var element = document.getElementById('svg');
        expect(isFocusable(element)).to.equal(supports.svgFocusMethod && supports.canFocusSvg);
      });

      bdd.it('should return {browser-specific} for <svg tabindex="-1">', function() {
        var element = document.getElementById('svg');
        element.setAttribute('tabindex', '-1');
        expect(isFocusable(element)).to.equal(supports.svgFocusMethod && supports.canFocusSvg || supports.canFocusSvgTabindexAttribute);
      });

      bdd.it('should return {browser-specific} for <a xlink:href="…">', function() {
        var element = document.getElementById('svg-link');
        expect(isFocusable(element)).to.equal(supports.svgFocusMethod);
      });

      bdd.it('should return true for <a xlink:href="…"> with except.onlyTabbable', function() {
        var element = document.getElementById('svg-link');
        var result = isFocusable.rules({
          context: element,
          except: {
            onlyTabbable: true,
          },
        });

        expect(result).to.equal(true);
      });

      bdd.it('should return false for <text>', function() {
        var element = document.getElementById('svg-link-text');
        expect(isFocusable(element)).to.equal(false);
      });
    });

    bdd.describe('for <object>', function() {
      bdd.it('should return {browser-specific} for <object> referencing an SVG', function() {
        var element = document.getElementById('object-svg');
        expect(isFocusable(element)).to.equal(supports.canFocusObjectSvg);
      });

      bdd.it('should return {browser-specific} for <object tabindex="-1"> referencing an SVG', function() {
        var element = document.getElementById('object-tabindex-svg');
        expect(isFocusable(element)).to.equal(supports.canFocusObjectSvg);
      });
    });

    bdd.describe('for <embed>', function() {
      bdd.before(function() {
        var element = document.getElementById('embed');
        if (!element) {
          this.skip('skipping to avoid test colliding with QuickTime');
        }
      });

      bdd.it('should return false for <embed>', function() {
        var element = document.getElementById('embed');
        expect(isFocusable(element)).to.equal(false);
      });

      bdd.it('should return false for <embed tabindex="0">', function() {
        var element = document.getElementById('embed-tabindex-0');
        expect(isFocusable(element)).to.equal(false);
      });
    });

    bdd.describe('for scrollable elements', function() {
      bdd.it('should return {browser-specific} for scrollable <div> without CSS overflow property', function() {
        var element = document.getElementById('scroll-container-without-overflow');
        expect(isFocusable(element)).to.equal(supports.canFocusScrollContainerWithoutOverflow);
      });

      bdd.it('should return {browser-specific} for scrollable <div> with CSS overflow property', function() {
        var element = document.getElementById('scroll-container');
        expect(isFocusable(element)).to.equal(supports.canFocusScrollContainer);
      });

      bdd.it('should return {browser-specific} for child of scrollable <div> without CSS overflow property', function() {
        var element = document.getElementById('scroll-body');
        expect(isFocusable(element)).to.equal(supports.canFocusScrollBody);
      });

      bdd.it('should return false for scrollable elements with except.scrollable', function() {
        var element = document.getElementById('scroll-container');
        var result = isFocusable.rules({
          context: element,
          except: {
            scrollable: true,
          },
        });

        expect(result).to.equal(false);
      });
    });

    bdd.describe('for CSS Flexbox Layout', function() {
      bdd.before(function() {
        fixture.add([
          /*eslint-disable indent */
          '<div id="flexbox-parent" style="display: -webkit-flex; display: -ms-flexbox; display: flex;">',
            '<span id="flexbox-child" style="display: block;">hello</span>',
          '</div>',
          /*eslint-enable indent */
        ]);
      });

      bdd.it('should return {browser-specific} for child of flexbox container', function() {
        var element = document.getElementById('flexbox-child');
        expect(isFocusable(element)).to.equal(supports.canFocusChildrenOfFocusableFlexbox);
      });

      bdd.it('should return {browser-specific} for flexbox container', function() {
        var element = document.getElementById('flexbox-parent');
        expect(isFocusable(element)).to.equal(supports.canFocusFlexboxContainer);
      });

      bdd.it('should return false for flexbox container with except.flexbox', function() {
        var element = document.getElementById('flexbox-parent');
        var result = isFocusable.rules({
          context: element,
          except: {
            flexbox: true,
          },
        });

        expect(result).to.equal(false);
      });
    });

    bdd.describe('for ShadowDOM', function() {
      var host;
      var root;

      bdd.before(function() {
        if (document.body.createShadowRoot === undefined) {
          this.skip('Shadow DOM not supported');
        }

        host = fixture.add([
          /*eslint-disable indent */
          '<div></div>',
          /*eslint-enable indent */
        ]).firstElementChild;
        root = host.createShadowRoot();
        root.innerHTML = '<input>';
      });

      bdd.it('should return false for ShadowHost', function() {
        expect(isFocusable(host)).to.equal(false);
      });

      bdd.it('should return true for ShadowHost with tabindex="-1"', function() {
        host.setAttribute('tabindex', '-1');
        expect(isFocusable(host)).to.equal(true);
      });
    });

  });
});
