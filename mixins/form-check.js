import { PREFIX } from '~/utils/configs';

const COMPONENT_CLASS = `${PREFIX}form-check`;

export default {
  inheritAttrs: false,

  inject: {
    formCheckGroup: {
      default: null
    }
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
    value: {},
    name: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    inline: Boolean
  },

  data() {
    return {
      localChecked: this.formCheckGroup
        ? this.formCheckGroup.checked
        : this.checked
    };
  },

  computed: {
    inputListeners: function() {
      const vm = this;
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: event => this.handleInput(event)
        }
      );
    },

    computedLocalChecked: {
      get() {
        return this.formCheckGroup
          ? this.formCheckGroup.localChecked
          : this.localChecked;
      },

      set(val) {
        if (this.formCheckGroup) {
          this.formCheckGroup.localChecked = val;
        } else {
          this.localChecked = val;
        }
      }
    }
  },

  watch: {
    checked(newValue) {
      this.computedLocalChecked = newValue;
    }
  },

  render(h) {
    const input = h('input', {
      directives: [{ name: 'model', value: this.computedLocalChecked }],
      domProps: {
        value: this.value,
        checked: this.isChecked
      },
      attrs: {
        ...this.$attrs,
        hidden: true,
        type: this.$isRadio ? 'radio' : 'checkbox',
        name: this.formCheckGroup ? this.formCheckGroup.name : this.name || null
      },
      class: `${COMPONENT_CLASS}__input`,
      on: this.inputListeners
    });

    const checkmark = h('span', {
      class: `${COMPONENT_CLASS}__checkmark`,
    });

    const text = h(
      'span',
      {
        class: `${COMPONENT_CLASS}__text`
      },
      [this.$slots.default || this.label]
    );

    return h(
      'label',
      {
        class: [COMPONENT_CLASS, this.inline && `${COMPONENT_CLASS}--inline`]
      },
      [input, checkmark, text]
    );
  }
};
