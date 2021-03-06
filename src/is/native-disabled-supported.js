
// Determine if an element supports the disabled attribute

import contextToElement from '../util/context-to-element';
import _supports from './native-disabled-supported.supports';
let supports;

// http://www.w3.org/TR/html5/disabled-elements.html#concept-element-disabled
let disabledElementsPattern;
const disabledElements = {
  input: true,
  select: true,
  textarea: true,
  button: true,
  fieldset: true,
  form: true,
};

export default function(context) {
  if (!supports) {
    supports = _supports();

    if (supports.canFocusDisabledFieldset) {
      delete disabledElements.fieldset;
    }

    if (supports.canFocusDisabledForm) {
      delete disabledElements.form;
    }

    disabledElementsPattern = new RegExp('^(' + Object.keys(disabledElements).join('|') + ')$');
  }

  const element = contextToElement({
    label: 'is/native-disabled-supported',
    context,
  });

  const nodeName = element.nodeName.toLowerCase();
  return Boolean(disabledElementsPattern.test(nodeName));
}
