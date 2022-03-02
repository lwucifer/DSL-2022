<template>
  <div class="news-sale">
    <img src="" alt="" class="news-sale__banner animated fadeIn" />
    <img :src="news_banner[0] ? news_banner[0].avatar : ''" alt="" class="news-sale__banner animated fadeIn" />

    <div class="container">
      <div class="row">
        <div
          class="col-12 col-md-4"
          v-for="(item, index) in listNewsItems"
          :key="index"
        >
          <SaleBox :data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { NEW_TYPE } from '~/utils/constants';
import { get } from 'lodash';

import SaleBox from '~/components/pages/news/SaleBox';

export default {
  components: {
    SaleBox
  },

  computed: {
    ...mapState('news/news', ['category_news', 'news_banner']),
    ...mapGetters('news/news', ['listNewsItems']),

    bannerImg() {
      const banner = this.category_news.filter(
        (i) => i.category_type == NEW_TYPE.SALE
      );
      return get(banner, '0.avatar', '');
    }
  },

  methods: {
    ...mapActions('news/news', ['getListNews', 'getCategoryNews', 'getNewsBanner'])
  },

  mounted() {
    const { category_id } = this.$route.params;
    this.getCategoryNews({category_id});
    this.getListNews({ category_id, type: NEW_TYPE.SALE });
    this.getNewsBanner({ type: NEW_TYPE.SALE, id: this.$route.params.category_id });
  }
};
</script>

<style lang="scss">
.news-sale__banner {
  object-fit: cover;
  max-height: 45rem;
  width: 100%;
}
</style>
