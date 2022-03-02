import { PREFIX } from '~/utils/configs';
import formCheckMixin from '~/mixins/form-check';

const COMPONENT_CLASS = PREFIX + 'radio';

export default {
  name: COMPONENT_CLASS,

  mixins: [formCheckMixin],

  props: {
    value: {
      type: [Number, String, Boolean],
      default: ''
    }
  },

  computed: {
    isChecked() {
      return this.value === this.computedLocalChecked
    }
  },

  created() {
    this.$isRadio = true;
  },

  watch: {
    computedLocalChecked(newValue) {
      this.$emit('input', newValue)
    }
  },

  methods: {
    handleInput({ target: { checked } }) {
      this.computedLocalChecked = checked ? this.value : null;
    }
  }
};
