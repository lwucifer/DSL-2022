import { PREFIX } from '~/utils/configs';
import { dispatchForCode } from '~/utils/common';

const COMPONENT_CLASS = PREFIX + 'counter';

export default {
  name: COMPONENT_CLASS,

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    tag: {
      type: String,
      default: 'span'
    },
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 9999
    },
    showValue: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      localValue: this.value
    };
  },

  watch: {
    value(newValue) {
      this.localValue = newValue
    },

    localValue(newValue) {
      this.$emit('input', newValue)
    }
  },

  methods: {
    decrease() {
      if (this.localValue <= this.min) return;
      this.localValue -= 1;
    },

    increase() {
      if (this.localValue >= this.max) return;
      this.localValue += 1;
    },

    decreaseByEnter(code) {
      if (code === 13 || code === "Enter") {
        this.decrease();
      }
    },

    increaseByEnter(code) {
      if (code === 13 || code === "Enter") {
        this.increase();
      }
    }
  },

  render(h) {
    const decreaseBtn = h('span', {
      attrs: {
        tabindex: 0
      },
      class: `${COMPONENT_CLASS}__button ${COMPONENT_CLASS}__button--decrease`,
      on: {
        click: this.decrease,
        keypress: event => dispatchForCode(event, this.decreaseByEnter)
      }
    });

    const increaseBtn = h('span', {
      attrs: {
        tabindex: 0
      },
      class: `${COMPONENT_CLASS}__button ${COMPONENT_CLASS}__button--increase`,
      on: {
        click: this.increase,
        keypress: event => dispatchForCode(event, this.increaseByEnter)
      }
    });

    const value = this.showValue ? h(
      'span',
      {
        class: `${COMPONENT_CLASS}__value`
      },
      this.localValue
    ) : null;

    return h(
      this.tag,
      {
        class: COMPONENT_CLASS
      },
      [decreaseBtn, value, increaseBtn]
    );
  }
};
