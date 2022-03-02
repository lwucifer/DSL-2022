import { PREFIX } from '~/utils/configs';

const COMPONENT_CLASS = `${PREFIX}form-check-group`;

export default {
  inheritAttrs: false,

  provide() {
    return {
      formCheckGroup: this
    };
  },

  model: {
    prop: 'checked',
    event: 'input'
  },

  props: {
    checked: {
      // v-model prop
      default: null
    },
    name: {
      type: String,
      default: 'form-check' + new Date().getTime()
    }
  },

  data() {
    return {
      localChecked: this.checked
    };
  },

  watch: {
    checked(newValue) {
      this.localChecked = newValue;
    },

    localChecked(newValue, oldValue) {
      this.$emit('input', newValue);
    }
  },

  render(h) {
    return h(
      'div',
      {
        class: COMPONENT_CLASS,
        attrs: {
          id: this.name
        }
      },
      this.$slots.default
    );
  }
};
