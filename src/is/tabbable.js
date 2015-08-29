
// determine if an element can be focused by keyboard (i.e. is part of the document's sequential focus navigation order)

import platform from 'platform';
import tabindexValue from '../util/tabindex-value';

// Internet Explorer 11 considers fieldset, table, td focusable, but not tabbable
// Internet Explorer 11 considers body to have [tabindex=0], but does not allow tabbing to it
const focusableElementsPattern = /^(fieldset|table|td|body)$/;

export default function(element) {
  if (element === document) {
    element = document.documentElement;
  }

  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    throw new TypeError('is/tabbable requires an argument of type Element');
  }

  const nodeName = element.nodeName.toLowerCase();
  const _tabindex = tabindexValue(element);
  const tabindex = _tabindex === null ? null : _tabindex >= 0;

  // NOTE: Firefox 31 considers [contenteditable] to have [tabindex=-1], but allows tabbing to it
  // fixed in Firefox 40 the latest - https://bugzilla.mozilla.org/show_bug.cgi?id=1185657
  if (element.hasAttribute('contenteditable')) {
    // tabbing can still be disabled by explicitly providing [tabindex="-1"]
    return tabindex !== false;
  }

  if (focusableElementsPattern.test(nodeName) && tabindex !== true) {
    return false;
  }

  // in Trident and Gecko SVGElement does not know about the tabIndex property
  if (element.tabIndex === undefined) {
    return false;
  }

  // In Internet Explorer the <audio> element is focusable, but not tabbable, and tabIndex property is wrong
  if (nodeName === 'audio' && !element.hasAttribute('controls')) {
    return false;
  }

  if (platform.name === 'Safari' && parseFloat(platform.version) < 9 && platform.os.family === 'iOS') {
    // iOS 8 only considers a hand full of elements tabbable (keyboard focusable)
    // this holds true even with external keyboards
    let potentiallyTabbable = (nodeName === 'input' && element.type === 'text' || element.type === 'password')
      || nodeName === 'select'
      || nodeName === 'textarea'
      || element.hasAttribute('contenteditable');

    if (!potentiallyTabbable) {
      const style = window.getComputedStyle(element, null);
      const userModify = style.webkitUserModify || '';
      if (userModify && userModify.indexOf('write') !== -1) {
        // http://www.w3.org/TR/1999/WD-css3-userint-19990916#user-modify
        // https://github.com/medialize/ally.js/issues/17
        potentiallyTabbable = true;
      }
    }

    if (!potentiallyTabbable) {
      return false;
    }
  }

  // http://www.w3.org/WAI/PF/aria-practices/#focus_tabindex
  return element.tabIndex >= 0;
}