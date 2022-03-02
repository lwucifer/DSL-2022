<template>
  <div class="overview-block">
    <span v-for="(item, index) in content" :key="index" class="mr-16">
      <slot :name="item.customSlot" :item="item">
        <div class="d-flex justify-content-between d-md-inline">
          {{ item.title }}: <b class="secondary">{{ item.text }}</b>
        </div>
      </slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) => ['title', 'text'].every((key) => key in item))
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_overview-block.scss';
</style>