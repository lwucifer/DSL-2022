import { createPopper } from '@popperjs/core';
import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { dispatchForCode } from '~/utils/common';
import renderSelectDefault from './select-default';
import renderSelectMultiple from './select-multiple';

const COMPONENT_CLASS = PREFIX + 'select';

export const selectProps = {
  options: {
    type: Array,
    default: () => [],
    validator: (value) =>
      value.every((option) => ['value', 'text'].every((key) => key in option))
  },
  value: {
    default: null
  },
  defaultValue: {
    default: null
  },
  mode: {
    type: String,
    default: 'default' // 'default' || 'tags' || 'multiple'
  },
  emptyMessage: {
    type: String,
    default: 'No option'
  },
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
  showClear: Boolean,
  searchable: Boolean,
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
  rounded: Boolean,
  optionsWrapperClass: {
    type: [String, Object, Array]
  },
  popperOptions: {
    type: Object,
    default: () => ({})
  },
  appendOptionsToBody: {
    type: Boolean,
    default: true
  },
  isRating: {
    type: Boolean,
    default: false
  }
};

export default {
  name: COMPONENT_CLASS,

  inheritAttrs: false,

  provide() {
    return {
      select: this
    };
  },

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
    event: 'input',
    prop: 'value'
  },

  props: selectProps,

  data() {
    const defaultValue = this.mode === 'default' ? null : [];

    return {
      popperInstance: null,
      isHidden: !this.localActive, // If options panel should not be in document
      localActive: false,
      search: '',
      localValue:
        this.value == null
          ? this.defaultValue || defaultValue
          : this.value || defaultValue,
      tmpOptions: this.options,
      optionsWidth: null,
      searchCanClear: true
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
        [`${COMPONENT_CLASS}--tags`]: this.mode === 'tags',
        [`${COMPONENT_CLASS}--multiple`]: this.mode === 'multiple',
        [`${COMPONENT_CLASS}--searchable`]: this.searchable,
        [`${COMPONENT_CLASS}--valid`]: this.valid === true,
        [`${COMPONENT_CLASS}--invalid`]: this.valid === false,
        [`${COMPONENT_CLASS}--rounded`]: this.rounded
      };
    },

    selected() {
      if (['tags', 'multiple'].indexOf(this.mode) > -1) {
        return this.localValue
          ? this.localValue.map((value) => {
              const optionItem = this.options.find(
                (option) => option.value === value
              );
              return optionItem;
            })
          : [];
      } else {
        const optSelected = this.options.find(
          (item) => item.value === this.localValue
        );
        return optSelected;
      }
    }
  },

  created() {
    this.COMPONENT_CLASS = COMPONENT_CLASS;
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
        });
      } else {
        this.destroyOptionsPanel();
      }
      this.$emit('visible-change', newValue);
    },

    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit('input', newValue, this.selected);
    },

    options: {
      immediate: true,
      handler() {
        this.setTmpOptions();
      }
    },

    search(newValue) {
      if (this.$listeners.search) {
        this.$emit('search', newValue);
      } else {
        this.setTmpOptions();
      }
    }
  },

  methods: {
    createOptionsPanel() {
      const { selected = {}, options = {} } = this.$refs;
      this.optionsWidth = selected.clientWidth;
      this.popperInstance = createPopper(selected, options, {
        placement: 'bottom-start',
        ...this.popperOptions
      });
    },

    destroyOptionsPanel() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },

    showOptionsPanel() {
      // Check first render
      if (this.isHidden) {
        this.isHidden = false;
      }

      this.$nextTick(() => {
        const timeout = setTimeout(() => {
          // If options panel is already showed, do nothing
          if (this.localActive) return;
          this.localActive = true;
          clearTimeout(timeout);
        }, 0);
      });
    },

    hideOptionsPanel() {
      if (this.localActive) {
        this.localActive = false;
        this.search = '';
      }
    },

    unSelectOption(index) {
      return this.localValue
        .slice(0, index)
        .concat(this.localValue.slice(index + 1, this.localValue.length));
    },

    handleClickOption(option) {
      if (['tags', 'multiple'].indexOf(this.mode) > -1) {
        this.search = '';
        if (this.localValue.includes(option.value)) {
          this.localValue = this.localValue.filter(
            (item) => item !== option.value
          );
        } else {
          this.localValue = [...this.localValue, option.value];
        }
      } else {
        // on default mode
        this.localValue = option.value;
        this.hideOptionsPanel();
      }
    },

    handleClickSelected() {
      if (this.localActive) {
        this.hideOptionsPanel();
        this.search = '';
      } else {
        this.showOptionsPanel();
        this.$nextTick(() => {
          this.$refs.search && this.$refs.search.focus();
        });
      }
    },

    handleSearchTag(e) {
      // Set width of input
      const { fieldSize } = this.$refs;
      const el = e.target;
      el.style.width = fieldSize.clientWidth + 'px';

      this.search = el.value;
      !!el.value && (this.searchCanClear = false);
    },

    handleKeyupSearchTag(e) {
      const { value } = e.target;
      // Show options panel if it's hide
      if (!this.localActive) {
        this.showOptionsPanel();
      }

      dispatchForCode(e, (code) => {
        // Clear latest value if blank
        if (code == 'Backspace' || code == 8) {
          if (!value && !this.searchCanClear) {
            this.searchCanClear = true;
            return;
          }

          this.searchCanClear &&
            (this.localValue = this.localValue.slice(
              0,
              this.localValue.length - 1
            ));
        }
      });
    },

    handleSearchDefault(e) {
      this.search = e.target.value;
    },

    handleCloseTag(id, index) {
      this.localValue = this.unSelectOption(index);
    },

    handleClickClear() {
      if (['tags', 'multiple'].indexOf(this.mode) > -1) {
        this.localValue = [];
      } else {
        this.localValue = null;
      }
    },

    setTmpOptions() {
      const enableSearch =
        this.searchable || ['tags', 'multiple'].indexOf(this.mode) > -1;
      if (enableSearch && this.search) {
        let serachRegExp = new RegExp();
        try {
          serachRegExp = new RegExp(this.search, 'i');
        } catch (error) {
          console.log('setTmpOptions error', error);
        }
        this.tmpOptions = this.options.filter((opt) =>
          serachRegExp.test(opt.text)
        );
      } else {
        this.tmpOptions = this.options;
      }
    },

    handleClickSearchDefault(e) {
      if (this.localActive) {
        e.stopPropagation();
      }
    }
  },

  render(h) {
    return h(
      'div',
      {
        directives: [
          {
            name: 'blur',
            expression: 'hideOptionsPanel'
          }
        ],
        class: [COMPONENT_CLASS, this.classes]
      },
      this.mode === 'default'
        ? renderSelectDefault(h, this)
        : renderSelectMultiple(h, this)
    );
  }
};
