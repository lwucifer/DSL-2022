<template>
  <div class="menu">
      <div class="menu__title body-1">{{$t("restaurant.menu")}}</div>

      <div class="menu__content">
        <div v-html="menu"></div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    menu: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/restaurant/_menu.scss';
</style>