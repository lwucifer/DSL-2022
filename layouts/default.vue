<template>
  <div class="layout-default" id="layout-default" sticky-container>
    <HeaderDefaultTopbar />
    <HeaderDefault v-sticky :sticky-z-index="20020" />

    <main class="page-content">
      <nuxt />
    </main>

    <Footer :data="partner.items" />

    <ScrollTo nameId="layout-default"/>

    <MenuMobile />
  </div>
</template>

<script>
import HeaderDefaultTopbar from '~/components/layouts/HeaderDefaultTopbar';
import HeaderDefault from '~/components/layouts/HeaderDefault';
import Footer from '~/components/layouts/Footer';
import ScrollTo from '~/components/pages/common/ScrollTo';
import MenuMobile from '~/components/layouts/MenuMobile';

import { mapActions, mapState } from 'vuex';

export default {
  name: 'default',
  
  components: {
    HeaderDefaultTopbar,
    HeaderDefault,
    Footer,
    ScrollTo,
    MenuMobile
  },

  computed: {
    ...mapState('home/home', ['partner'])
  },

  methods: {
    ...mapActions('home/home', ['getHomePartner'])
  },

  mounted() {
    this.getHomePartner();

    // if (ZaloSocialSDK) ZaloSocialSDK.reload();
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/layouts/_default.scss';
</style>
