import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'input';
const TYPES = [
  'text',
  'number',
  'tel',
  'email',
  'address',
  'password',
  'search'
];

export default {
  name: COMPONENT_CLASS,

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: value => {
        if (TYPES.includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'type' must be in ${JSON.stringify(
              TYPES
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    size: {
      type: String,
      default: 'md',
      validator: value => {
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
    prepend: String,
    append: String,
    appendClass: [String, Object, Array],
    square: Boolean,
    rounded: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    valid: {
      default: null,
      validator: value => {
        if ([null, true, false].findIndex(item => item === value) > -1) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'valid' controls the validation state appearance of the component. 'true' for valid, 'false' for invalid, or 'null' for no validation state.\nIt's must be in [null, true, false]. Current: ${value}`
          );
          return false;
        }
      }
    }
  },

  data() {
    return {
      localValue: this.value,
      focus: false
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
        [`${COMPONENT_CLASS}--square`]: this.square,
        [`${COMPONENT_CLASS}--rounded`]: this.rounded,
        [`${COMPONENT_CLASS}--focus`]: this.focus,
        [`${COMPONENT_CLASS}--disabled`]: this.disabled,
        [`${COMPONENT_CLASS}--readonly`]: this.readonly,
        [`${COMPONENT_CLASS}--valid`]: this.valid === true,
        [`${COMPONENT_CLASS}--invalid`]: this.valid === false
      };
    },

    inputListeners() {
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          input: this.handleInput, // This ensures that the component works with v-model
          focus: this.handleFocus,
          blur: this.handleBlur
        }
      );
    }
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit('input', newValue);
    }
  },

  methods: {
    handleInput(event) {
      this.localValue = event.target.value;
    },

    handleFocus() {
      this.focus = true;
    },

    handleBlur() {
      this.focus = false;
      this.$emit('blur')
    }
  },

  render(h) {
    const makeInput = () => h('input', {
      class: `${COMPONENT_CLASS}__input`,
      attrs: {
        ...this.$attrs,
        type: this.type,
        disabled: this.disabled,
        readonly: this.readonly
      },
      domProps: {
        value: this.localValue
      },
      on: this.inputListeners
    });

    const makePrepend = () => h(
      'div',
      {
        class: `${COMPONENT_CLASS}__prepend`
      },
      [this.$slots.prepend || this.prepend]
    );

    const makeAppend = () => h(
      'div',
      {
        staticClass: `${COMPONENT_CLASS}__append `,
        class: this.appendClass
      },
      [this.$slots.append || this.append]
    );

    return h(
      this.tag,
      {
        class: [COMPONENT_CLASS, this.classes]
      },
      [
        (this.$slots.prepend || this.prepend) && makePrepend(),
        makeInput(),
        (this.$slots.append || this.append) && makeAppend()
      ]
    );
  }
};
