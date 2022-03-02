<template>
  <div class="input-search">
    <v-input
      v-model="localValue"
      class="input-search__input"
      :placeholder="placeholder"
      @keyup.enter="handleBtnClick"
      :size="size"
    />
    <v-button
      class="input-search__btn"
      variant="primary"
      :size="size"
      @click="handleBtnClick"
    >
      <IconSearch2 class="icon" />
    </v-button>
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

import IconSearch2 from '~/assets/icons/search-2.svg?inline';

export default {
  components: {
    IconSearch2
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'lg',
      validator: (value) => {
        if (COMPONENT_SIZE_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `InputSearch prop 'size' must be in ${JSON.stringify(
              COMPONENT_SIZE_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    placeholder: String
  },

  data() {
    return {
      localValue: ''
    };
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
    handleBtnClick() {
      this.$emit('search', this.localValue);
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_input-search.scss';
</style>
