import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { dispatchForCode } from '~/utils/common';

const COMPONENT_CLASS = PREFIX + 'switch';
const DEFAULT_SIZE = COMPONENT_SIZE_LIST[0];

export default {
  name: COMPONENT_CLASS,

  inheritAttrs: false,

  model: {
    event: 'input',
    prop: 'checked'
  },

  props: {
    checked: Boolean,
    disabled: Boolean,
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
    }
  },

  data() {
    return {
      localChecked: this.checked
    };
  },

  computed: {
    classes() {
      const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
        if (size === DEFAULT_SIZE) return cls;
        cls[`${COMPONENT_CLASS}--${size}`] = this.size === size ? true : false;
        return cls;
      }, {});

      return {
        ...sizeClasses,
        disabled: this.disabled,
        checked: this.localChecked
      };
    }
  },

  watch: {
    checked(newValue) {
      this.localChecked = newValue;
    },

    localChecked(newValue) {
      this.$emit('input', newValue);
    }
  },

  methods: {
    handleInput(event) {
      this.localChecked = event.target.checked;
    },

    toggleValueByEnter(code) {
      if (code === 13 || code === 'Enter') {
        this.localChecked = !this.localChecked;
      }
    }
  },

  render(h) {
    const input = h('input', {
      attrs: {
        ...this.$attrs,
        type: 'checkbox',
        hidden: true
      },
      domProps: {
        checked: this.localChecked
      },
      on: {
        input: this.handleInput
      },
      class: `${COMPONENT_CLASS}__checkbox`
    });

    const slider = h('span', {
      class: `${COMPONENT_CLASS}__slider`
    });

    return h(
      'label',
      {
        attrs: {
          tabindex: 0
        },
        class: [COMPONENT_CLASS, this.classes],
        on: {
          keypress: (event) => dispatchForCode(event, this.toggleValueByEnter)
        }
      },
      [input, slider]
    );
  }
};
