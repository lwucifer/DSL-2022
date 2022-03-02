<template>
  <div>
    <h4 class="mb-3 title-box">{{$t("header.transaction_history")}}</h4>

    <div class="v-tabs__tab-list">
      <n-link
        v-for="(tab, index) in TABS"
        :key="index"
        :to="`/${defaultLangCode}${tab.routePath}`"
        class="v-tabs__tab-item"
        :class="{
          active: $route.path.includes(`/${defaultLangCode}${tab.routePath}`)
        }"
        >{{ $t(tab.text) }}</n-link
      >
    </div>

    <nuxt-child />
  </div>
</template>

<script>
import NotFound from '~/components/pages/common/NotFound';
import NotFoundImage from '~/assets/icons/not-found-2.svg?inline';

import { mapGetters } from 'vuex';

const TABS = [
  {
    routePath: `/account/booking-history/hotel`,
    text: 'home.hotel'
  },
  {
    routePath: `/account/booking-history/restaurant`,
    text: 'header.restaurants'
  },
  {
    routePath: `/account/booking-history/tour`,
    text: 'home.tour'
  },
  {
    routePath: `/account/booking-history/product-tourism`,
    text: 'home.product_travel'
  }
];
export default {
  components: {
    NotFound,
    NotFoundImage
  },

  data() {
    return {};
  },

  created() {
    this.TABS = TABS;
  },

  computed: {
    ...mapGetters('common/common', ['defaultLangCode'])
  }
};
</script>

<style lang="scss">
.title-box {
  margin-top: 1.6rem;

  @media(min-width: 768px) {
    margin-top: 0;
  }
}
</style>
