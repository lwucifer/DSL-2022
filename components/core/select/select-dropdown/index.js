import { createPopper } from '@popperjs/core';
import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { setPropSize } from '~/utils/common';
import { SimplePortal } from '~/utils/simple-portal';

const COMPONENT_CLASS = PREFIX + 'select';

const renderPrepend = (h, vm) =>
  h(
    'span',
    {
      class: `${COMPONENT_CLASS}__prepend`
    },
    [
      vm.$slots.prepend
        ? vm.$slots.prepend
        : vm.$scopedSlots.prepend
        ? vm.$scopedSlots.prepend({
            selected: vm.selected
          })
        : vm.prepend
    ]
  );

const renderAppend = (h, vm) =>
  h(
    'span',
    {
      class: `${COMPONENT_CLASS}__append`
    },
    [
      vm.$slots.append
        ? vm.$slots.append
        : vm.$scopedSlots.append
        ? vm.$scopedSlots.append({
            selected: vm.selected
          })
        : vm.append
    ]
  );

const renderArrow = (h, vm) =>
  h(
    'span',
    {
      class: `${COMPONENT_CLASS}__arrow`
    },
    [vm.$slots['placeholder-icon'] || h('span')]
  );

const renderSelected = (h, vm) => {
  const prepend =
    vm.$slots.prepend || vm.$scopedSlots.prepend ? renderPrepend(h, vm) : null;
  const append =
    vm.$slots.append || vm.$scopedSlots.append ? renderAppend(h, vm) : null;
  const selected = h(
    'div',
    {
      class: `${COMPONENT_CLASS}__selected-value`
    },
    vm.$slots.selected
  );

  const arrow = vm.showArrow ? renderArrow(h, vm) : null;

  return h(
    'div',
    {
      ref: 'selected',
      class: `${COMPONENT_CLASS}__selected`,
      attrs: {
        tabindex: '0'
      },
      on: {
        click: vm.handleClickSelected
      }
    },
    [prepend, selected, append, arrow]
  );
};

const renderOptions = (h, vm) =>
  h(SimplePortal, {}, [
    h(
      'div',
      {
        ref: 'options',
        attrs: { hidden: !vm.localActive },
        class: `${COMPONENT_CLASS}__options-wrapper`,
        style: {
          width: setPropSize(vm.optionsWidth),
          minWidth: vm.optionsMinWidth + 'px'
        }
      },
      [
        h(
          'div',
          {
            class: `${COMPONENT_CLASS}__options`
          },
          vm.$slots.options
        )
      ]
    )
  ]);

export default {
  name: COMPONENT_CLASS,

  directives: {
    blur: {
      bind: function (el, binding, vnode) {
        vnode.context.$_handleBlur = (event) => {
          if (!vnode.context.localActive) return;
          const { options } = vnode.context.$refs;
          if (!options) return;
          const isTargetEl = event.target === el || el.contains(event.target);
          const isTargetOptions =
            event.target === options || options.contains(event.target);
          if (!isTargetEl && !isTargetOptions) {
            vnode.context[binding.expression]();
          }
        };
        window.addEventListener('click', vnode.context.$_handleBlur);
      },

      unbind: function (el, binding, vnode) {
        window.removeEventListener('click', vnode.context.$_handleBlur);
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
    valid: {
      default: null,
      validator: (value) => {
        if ([null, true, false].findIndex((item) => item === value) > -1) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'valid' controls the validation state appearance of the component. 'true' for valid, 'false' for invalid, or 'null' for no validation state.\nIt's must be in [null, true, false]. Current: ${value}`
          );
          return false;
        }
      }
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    active: Boolean,
    prepend: {
      type: [String, Number],
      default: null
    },
    append: {
      type: [String, Number],
      default: null
    },
    optionsWidth: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      popperInstance: null,
      isHidden: !this.active,
      localActive: false,
      optionsMinWidth: null
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
        active: this.localActive,
        [`${COMPONENT_CLASS}--disabled`]: this.disabled,
        [`${COMPONENT_CLASS}--valid`]: this.valid === true,
        [`${COMPONENT_CLASS}--invalid`]: this.valid === false
      };
    }
  },

  watch: {
    active(newValue) {
      this.localActive = newValue;
    },

    localActive(newValue) {
      if (newValue) {
        const timeout = setTimeout(() => {
          this.createOptionsPanel();
          clearTimeout(timeout);
        }, 0);
      } else {
        this.destroyOptionsPanel();
      }
      this.$emit('visible-change', newValue);
    }
  },

  methods: {
    createOptionsPanel() {
      const { selected = {}, options = {} } = this.$refs;
      this.optionsMinWidth = selected.clientWidth;
      this.popperInstance = createPopper(selected, options, {
        placement: 'bottom-start'
      });
    },

    destroyOptionsPanel() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },

    showOptionsPanel() {
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

    hideOptionsPanel() {
      if (this.localActive) {
        this.localActive = false;
      }
    },

    handleClickSelected() {
      if (this.localActive) {
        this.hideOptionsPanel();
      } else {
        this.showOptionsPanel();
      }
    }
  },

  render(h) {
    return h(
      'div',
      {
        directives: [{ name: 'blur', expression: 'hideOptionsPanel' }],
        class: [COMPONENT_CLASS, this.classes]
      },
      [renderSelected(h, this), this.isHidden ? h() : renderOptions(h, this)]
    );
  }
};
