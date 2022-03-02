import { createPopper } from '@popperjs/core';
import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { setPropSize } from '~/utils/common';
import { SimplePortal } from '~/utils/simple-portal';

const COMPONENT_CLASS = PREFIX + 'dropdown';

const renderActivator = (h, vm) => {
  const activator = vm.$scopedSlots.activator
    ? vm.$scopedSlots.activator({})
    : vm.$slots.activator;

  return h(
    'span',
    {
      ref: 'activator',
      class: `${COMPONENT_CLASS}__activator`,
      attrs: {
        tabindex: '0'
      },
      on: vm.activatorListeners
    },
    [activator]
  );
};

const renderDropdownPanel = (h, vm) =>
  h(SimplePortal, {}, [
    h(
      'div',
      {
        ref: 'dropdownPanel',
        attrs: { hidden: !vm.localActive },
        staticClass: `${COMPONENT_CLASS}__dropdown-panel`,
        class: vm.panelClass,
        style: {
          width: setPropSize(vm.panelWidth),
          zIndex: vm.zIndex
        }
      },
      [
        h(
          'div',
          {
            staticClass: `${COMPONENT_CLASS}__content`,
            class: vm.contentClass
          },
          vm.$scopedSlots.default({})
        )
      ]
    )
  ]);

export default {
  name: COMPONENT_CLASS,

  directives: {
    blur: {
      bind: function (el, binding, vnode) {
        const checkEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

        vnode.context.$_handleBlur = (event) => {
          if (!vnode.context.localActive) return;
          const { dropdownPanel } = vnode.context.$refs;
          if (!dropdownPanel) return;
          const isTargetEl = event.target === el || el.contains(event.target);
          const isTargetDropdownPanel =
            event.target === dropdownPanel ||
            dropdownPanel.contains(event.target);
          if (!isTargetEl && !isTargetDropdownPanel) {
            vnode.context[binding.expression]();
          }
        };

        window.addEventListener(checkEvent, vnode.context.$_handleBlur);
      },

      unbind: function (el, binding, vnode) {
        const checkEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
        window.removeEventListener(checkEvent, vnode.context.$_handleBlur);
      }
    }
  },

  model: {
    prop: 'active',
    event: 'visible-change'
  },

  props: {
    size: {
      type: String,
      default: COMPONENT_SIZE_LIST[0],
      validator: (value) => {
        if (COMPONENT_SIZE_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'size' must be in ${JSON.stringify(
              COMPONENT_SIZE_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    active: Boolean,
    panelWidth: {
      type: [String, Number],
      default: null
    },
    zIndex: Number,
    panelClass: {
      type: [Array, Object, String]
    },
    contentClass: {
      type: [Array, Object, String]
    },
    trigger: {
      type: String,
      default: 'click',
      validator: (value) => {
        if (['click', 'hover'].includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'trigger' must be in ${JSON.stringify([
              'hover',
              'focus'
            ])}, current: '${value}'`
          );
          return false;
        }
      }
    },
    placement: {
      type: String,
      default: 'bottom-start',
      validator: (value) =>
        [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'
        ].includes(value) // placement of popper lib
    }
  },

  data() {
    return {
      popperInstance: null,
      isHidden: !this.active,
      localActive: false
    };
  },

  computed: {
    classes() {
      const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
        cls[`${COMPONENT_CLASS}--${size}`] = this.size === size ? true : false;
        return cls;
      }, {});

      return {
        ...sizeClasses,
        active: this.localActive
      };
    },

    activatorListeners() {
      if (this.trigger === 'click') {
        return {
          click: this.handleClickActivator
        };
      } else if (this.trigger === 'hover') {
        return {
          mouseenter: this.showDropdownPanel,
          mouseleave: this.hideDropdownPanel
        };
      }
    }
  },

  watch: {
    active(newValue) {
      this.localActive = newValue;
    },

    localActive(newValue) {
      if (newValue) {
        const timeout = setTimeout(() => {
          this.createDropdownPanel();
          clearTimeout(timeout);
        }, 0);
      } else {
        this.destroyDropdownPanel();
      }
      this.$emit('visible-change', newValue);
    }
  },

  methods: {
    createDropdownPanel() {
      const { activator = {}, dropdownPanel = {} } = this.$refs;
      this.popperInstance = createPopper(activator, dropdownPanel, {
        placement: this.placement
      });
    },

    destroyDropdownPanel() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },

    showDropdownPanel() {
      if (this.isHidden) {
        this.isHidden = false;
      }

      this.$nextTick(() => {
        const timeout = setTimeout(() => {
          if (this.localActive) return;
          this.localActive = true;
          clearTimeout(timeout);
        });
      });
    },

    hideDropdownPanel(event) {
      if (!this.localActive) return;
      const { dropdownPanel } = this.$refs;

      if (event && this.trigger === 'hover') {
        const { toElement } = event;

        if (dropdownPanel === toElement || dropdownPanel.contains(toElement)) {
          dropdownPanel &&
            dropdownPanel.addEventListener(
              'mouseleave',
              this.hideDropdownPanel
            );
          return;
        }
      }

      dropdownPanel &&
        dropdownPanel.removeEventListener('mouseleave', this.hideDropdownPanel);
      this.localActive = false;
    },

    handleClickActivator() {
      if (this.localActive) {
        this.hideDropdownPanel();
      } else {
        this.showDropdownPanel();
      }
    }
  },

  render(h) {
    return h(
      'div',
      {
        directives: [{ name: 'blur', expression: 'hideDropdownPanel' }],
        class: [COMPONENT_CLASS, this.classes]
      },
      [
        renderActivator(h, this),
        this.isHidden ? h() : renderDropdownPanel(h, this)
      ]
    );
  }
};
