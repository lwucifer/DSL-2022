<template>
  <div class="page-account page-content-inner container" id="container-common-search-form">
    <div class="row">
      <div class="d-none d-md-block col-md-4 col-xl-3 mb-5">
        <AccountAside />
      </div>

      <div class="col-12 col-md-8 col-xl-9">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>

<script>
import AccountAside from '~/components/pages/account/info/AccountAside';

export default {
  components: {
    AccountAside
  }
}
</script>

<style lang="scss">
@import "~/assets/scss/pages/account/_index.scss";
</style>