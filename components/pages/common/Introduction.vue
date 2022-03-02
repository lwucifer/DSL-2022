<template>
  <section class="introduction">
    <h2 class="introduction__title heading-5 mb-4">{{ data.title }}</h2>

    <div class="introduction__intro" v-if="data.intro && data.intro.length > 0" v-html="data.intro"></div>

    <div class="introduction__content" v-html="data.content"></div>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_introduction.scss';
</style>