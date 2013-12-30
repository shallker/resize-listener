var eventy = require('eventy');

module.exports = ResizeListener;

function ResizeListener(el) {
  var checkingInterval = 100;
  var thisResizeListener = eventy(this);

  var offsetWidth = el.offsetWidth;
  var clientWidth = el.clientWidth;
  var scrollWidth = el.scrollWidth;
  var offsetHeight = el.offsetHeight;
  var clientHeight = el.clientHeight;
  var scrollHeight = el.scrollHeight;

  setInterval(function checkSize() {
    if (offsetWidth !== el.offsetWidth) {
      return sizeChangeDetected();
    }

    if (clientWidth !== el.clientWidth) {
      return sizeChangeDetected();
    }

    if (scrollWidth !== el.scrollWidth) {
      return sizeChangeDetected();
    }

    if (offsetHeight !== el.offsetHeight) {
      return sizeChangeDetected();
    }

    if (clientHeight !== el.clientHeight) {
      return sizeChangeDetected();
    }

    if (scrollHeight !== el.scrollHeight) {
      return sizeChangeDetected();
    }
  }, checkingInterval);

  function sizeChangeDetected() {
    resetSize();
    thisResizeListener.trigger('resize');
  }

  function resetSize() {
    offsetWidth = el.offsetWidth;
    clientWidth = el.clientWidth;
    scrollWidth = el.scrollWidth;
    offsetHeight = el.offsetHeight;
    clientHeight = el.clientHeight;
    scrollHeight = el.scrollHeight;
  }
}
