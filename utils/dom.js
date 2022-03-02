const w = typeof window !== 'undefined' ? window : {};

/**
 * Use window.requestAnimationFrame() method.
 * If requestAnimationFrame not supported, 
 * run a callback timeout with 16ms instead athough it's not really true.
 */
export const requestAF =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.mozRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.oRequestAnimationFrame ||
  // Fallback, but not a true polyfill
  // Only needed for Opera Mini
  /* istanbul ignore next */
  (cb => setTimeout(cb, 16));


/**
 * To get offset of element
 * @param { HTMLElement } el 
 */
export const offset = el => {
  let left = 0;
  let top = 0;

  if (el.offsetParent) {
    do {
      // if el transformed by popper
      if (el.style.transform) {
        const rect = el.getBoundingClientRect();
        left += rect.left;
        top += el.top;
      } else {
        left += el.offsetLeft;
        top += el.offsetTop;
      }
    } while ((el = el.offsetParent));
  }

  return {
    left,
    top
  };
};

/**
 * Move cursor to el apply for input, textarea
 * @param { HTMLElement } el
 */
export function moveCursorToEnd(el) {
  if (typeof el.selectionStart == "number") {
      el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined") {
      el.focus();
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
  }
}

/**
 * Trigger event
 * @param { HTMLElement } el - Element to trigger
 * @param { String } type - Event name
 */
export function triggerEvent(el, type) {
  // IE9+ and other modern browsers
  if ('createEvent' in document) {
      var e = document.createEvent('HTMLEvents');
      e.initEvent(type, false, true);
      el.dispatchEvent(e);
  } else {
      // IE8
      var e = document.createEventObject();
      e.eventType = type;
      el.fireEvent('on' + e.eventType, e);
  }
}

/**
 * This function should give you width of scrollbar
 */
export function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}
