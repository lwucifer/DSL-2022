<template>
  <div
    class="not-found"
    :class="{ 'not-found--vertical': this.direction == 'vertical' }"
  >
    <span class="not-found__icon">
      <slot name="icon">
        <IconNotFound />
      </slot>
    </span>

    <span class="not-found__text">
      <slot name="text">{{ $t(text) }}</slot>
    </span>
  </div>
</template>

<script>
import IconNotFound from '~/assets/icons/not-found.svg?inline';

export default {
  components: {
    IconNotFound
  },

  props: {
    text: {
      type: String,
      default: 'header.no_match_found'
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'vertical'].includes(value)
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_not-found.scss';
</style>