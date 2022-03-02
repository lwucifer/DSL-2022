<template>
  <div
    slot="activator"
    class="range-price"
    :class="{ 'range-price--truncate': truncate }"
  >
    {{ $t('header.price_from') }}
    <b class="primary ml-2 mr-2"
      >{{
        (range[0] || 0) | priceTransform(currentExchangeRate) | numeralFormat
      }}
      {{ currentUnitCode }}</b
    >
    {{ $t('header.come') }}
    <b class="primary ml-2"
      >{{ (range[1] || 0) | priceTransform(currentExchangeRate) | numeralFormat
      }}{{ range[1] === RANGE_SLIDER_VALUE.MAX_DISPLAY ? '+' : '' }}
      {{ currentUnitCode }}</b
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { RANGE_SLIDER_VALUE } from '~/utils/constants';

export default {
  props: {
    range: {
      type: Array,
      default: [0, 0]
    },
    truncate: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode'])
  },

  created() {
    this.RANGE_SLIDER_VALUE = Object.freeze(RANGE_SLIDER_VALUE);
  }
};
</script>

<style lang="scss">
.range-price--truncate {
  @include text-overflow;
}
</style>