// Private components for use by Tooltips, Popovers and Modals
// Base on: https://github.com/LinusBorg/vue-simple-portal
// And refer from: https://github.com/bootstrap-vue/bootstrap-vue/blob/dev/src/utils/transporter.js
import Vue from 'vue';
import { PREFIX } from '~/utils/configs';
import { isBrowser } from '~/utils/common';

/**
 * Portal container used by SimplePortal ("v-simple-portal")
 */
const SimplePortalContainer = Vue.extend({
  name: PREFIX + 'simple-portal-container',

  // as an abstract component, it doesn't appear in
  // the $parent chain of components.
  // which means the next parent of any component rendered inside of this oen
  // will be the parent from which is was portal'd
  abstract: true,

  props: {
    nodes: {
      type: [Array, Function]
    },
    tag: {
      type: String,
      default: 'div'
    }
  },

  data: vm => ({
    updatedNodes: vm.nodes
  }),

  destroyed() {
    const { $el: el } = this;
    el.parentNode.removeChild(el);
  },

  render(h) {
    const nodes = this.updatedNodes && this.updatedNodes();
    if (!nodes) return h();
    return nodes.length < 2 && !nodes[0].text ? nodes : h(this.tag);
  }
});

/**
 * This component has no root element
 */
export const SimplePortal = Vue.extend({
  name: PREFIX + 'simple-portal',

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    disabled: Boolean,
    container: {
      // String: CSS selector,
      // HTMLElement: Element reference
      // Mainly needed for tooltips/popovers inside modals
      type: [String, Object], // Object = HTMLElement
      default: 'body'
    }
  },

  created() {
    // Create private non-reactive props
    this.$target = null;
    this.$_slotDefaultFn = null;
  },

  beforeMount() {
    this.mountTarget();
  },

  updated() {
    // We need to make sure that all children have completed updating
    // before rendering in the target
    // `vue-simple-portal` has the this in a `$nextTick()`,
    // while `portal-vue` doesn't
    // Just trying to see if the `$nextTick()` delay is required or not
    // Since all slots in Vue 2.6.x are always functions
    this.updateTarget();
  },

  beforeDestroy() {
    this.unmountTarget();
    this.$_defaultFn = null;
  },

  watch: {
    disabled: {
      immediate: true,
      handler(disabled) {
        disabled ? this.unmountTarget() : this.$nextTick(this.mountTarget);
      }
    }
  },

  methods: {
    getContainer() {
      if (isBrowser) {
        const container = this.container;
        return typeof container === 'string'
          ? document.querySelector(container)
          : container;
      } else {
        return null;
      }
    },

    mountTarget() {
      if (!this.$target) {
        const container = this.getContainer();

        if (container) {
          const el = document.createElement('div');
          container.appendChild(el);
          this.$target = new SimplePortalContainer({
            el,
            parent: this,
            propsData: {
              tag: this.tag,
              nodes: this.$scopedSlots.default
            }
          });
        }
      }
    },

    updateTarget() {
      if (isBrowser && this.$target) {
        const slotDefaultFn = this.$scopedSlots.default;

        if (!this.disabled) {
          if (slotDefaultFn && this.$_slotDefaultFn !== slotDefaultFn) {
            // We only update the target component if the scoped slot
            // function is a fresh one. The new slot syntax (since Vue 2.6)
            // can cache unchanged slot functions and we want to respect that here
            this.$target.updatedNodes = slotDefaultFn;
          } else if (!slotDefaultFn) {
            // We also need to be back compatible with non-scoped default slot (i.e. 2.5.x)
            this.$target.updatedNodes = this.$slots.default;
          }
          // Update the scoped slot function cache
          this.$_slotDefaultFn = slotDefaultFn;
        }
      }
    },

    unmountTarget() {
      this.$target && this.$target.$destroy();
      this.$target = null;
    }
  },

  render(h) {
    if (this.disabled) {
      const nodes = this.$scopedSlots && this.$scopedSlots.default();
      if (!nodes) return h();
      return nodes.length < 2 && !nodes[0].text ? nodes : h(this.tag, nodes);
    }
    return h();
  }
});
