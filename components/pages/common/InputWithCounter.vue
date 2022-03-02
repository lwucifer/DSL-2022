<template>
  <v-input
    ref="vInput"
    v-bind="$attrs"
    :value="localValue"
    v-on="listeners"
    type="number"
    class="input-with-counter"
  >
    <v-counter
      slot="append"
      v-model="localValue"
      :showValue="false"
      :min="min"
      :max="max"
    />
  </v-input>
</template>

<script>
export default {
  inheritAttrs: false,
  
  model: {
    event: 'input',
    prop: 'value'
  },

  props: {
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
    }
  },

  data() {
    return {
      localValue: this.value || 0
    };
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.handleInput
      };
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
    handleInput(value) {
      const newValue = isNaN(value) ? 0 : parseInt(value);
      if (newValue < this.min || newValue > this.max) {
        this.$refs.vInput.localValue =
          newValue < this.min
            ? this.min
            : newValue > this.max
            ? this.max
            : this.localValue;
      } else {
        this.localValue = newValue;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_input-with-counter.scss';
</style>
