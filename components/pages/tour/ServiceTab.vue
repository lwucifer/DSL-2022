<template>
  <section class="service-tab bg-white pa-16">
    <h2 class="service-tab__title heading-5 mb-16">{{ title }}</h2>

    <div class="service-tab__tab" role="tablist">
      <span
        v-for="(item, index) in tabs"
        role="tab"
        :key="index"
        :class="{ active: tabActive === index }"
        @click="tabActive = index"
        >{{ item }}</span
      >
    </div>

    <template v-for="(item, index) in tabs">
      <div
        v-show="tabActive === index"
        :key="index"
        role="tabpanel"
        :aria-hidden="tabActive === index ? 'true' : 'false'"
      >
        <slot :name="`tab${index + 1}`" />
      </div>
    </template>
  </section>
</template>

<script>
export default {
  props: {
    title: String,
    tabs: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      tabActive: 0
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/tour/_service-tab.scss';
</style>