import { PREFIX } from '~/utils/configs';

const COMPONENT_CLASS = PREFIX + 'select-option';

export default {
  name: COMPONENT_CLASS,

  inject: {
    parentSelect: {
      from: 'select',
      default: null
    }
  },

  props: {
    value: {},
    text: {
      type: String,
      default: ''
    }
  },

  methods: {
    handleClick() {
      if (!this.parentSelect) return;
      this.parentSelect.handleClickOption({ value, text });
    }
  },

  render(h) {
    return h(
      'div',
      {
        class: `${COMPONENT_CLASS}`,
        on: {
          click: this.handleClick
        }
      },
      this.$slots.default || option.text
    );
  }
};
