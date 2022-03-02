import { PREFIX } from '~/utils/configs';
import formCheckMixin from '~/mixins/form-check';

const COMPONENT_CLASS = PREFIX + 'checkbox';

export default {
  name: COMPONENT_CLASS,

  mixins: [formCheckMixin],

  props: {
    value: {
      default: true
    }
  },

  computed: {
    isChecked() {
      return this.computedLocalChecked == this.value;
    }
  },

  watch: {
    computedLocalChecked(newValue) {
      this.$emit('input', newValue);
    }
  },

  methods: {
    handleInput(event) {
      const { checked } = event.target;
      this.computedLocalChecked = checked ? this.value : null;
    }
  }
};
