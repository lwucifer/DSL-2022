import Vue from 'vue';

const handleClick = (event, el, binding, vnode) => {
  !(event.target === el || el.contains(event.target)) &&
    vnode.context[binding.expression]();
};

Vue.directive('click-outside', {
  bind: (el, binding, vnode) => {
    const checkEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
    vnode.$_clickOutsideHandler = event =>
      handleClick(event, el, binding, vnode);
    window.addEventListener(checkEvent, vnode.$_clickOutsideHandler);
  },

  unbind: (el, binding, vnode) => {
    const checkEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
    window.removeEventListener(checkEvent, vnode.$_clickOutsideHandler);
  }
});
