<template>
  <div v-swiper:mySwiper="swiperOption" class="home-swiper pb-0">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="row">
          <div
            class="col-6 h-100"
            v-for="(item, index) in data.slice(0, 4)"
            :key="index"
          >
            <HotelBox
              :img-attrs="item.thumbnail"
              :isShare="false"
              :title="item.name"
              :rating="item.rate_score"
              :ratingCount="item.vote_number"
              :address="item.address"
              :levelHotel="item.rating_level_name"
              :fromPrice="item.from_price_value"
              :currencyCode="item.currency_code"
              :isLiked="!!item.is_favorite"
              :to="`/${defaultLangCode}/hotel/detail/${item.id}`"
              @like="handleLike(item.id, item.is_favorite)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>

<script>
import HotelBox from '~/components/pages/common/HotelBox';

import { mapActions, mapGetters } from 'vuex';
import { PRODUCT_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

export default {
  components: {
    HotelBox
  },

  props: {
    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        loop: false,
        autoplay: {
          delay: 5000
        }
      },

      likeLoading: false
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode']),
  },

  methods: {
    ...mapActions('home/home', ['postFavorite']),

    async handleLike(id, isLike) {
      if (this.isAuthenticated) {
        if (this.likeLoading) return;
        this.likeLoading = true;

        const result = await this.postFavorite({
          type: PRODUCT_TYPE.HOTEL,
          id: id,
          isFavorite: isLike ? 0 : 1
        });

        const actionName = isLike ? this.$t("home.delete") : this.$t("home.save");
        if (result.code == RES_STATUS_SUCCESS) {
          isLike &&
            this.$toasted.success(`${actionName} ` + this.$t('home.from_list_favourite'));
          !isLike &&
            this.$toasted.success(`${actionName} ` + this.$t('home.to_list_favourite'));

            this.$emit('reload');
        } else {
          if (result.code === 999) {
            this.likeLoading = false;
            this.handleLike(id, !isLike)
          } else {
            this.$toasted.error(`${actionName} ` + this.$t('home.failed'));
          }
        }
  
        this.likeLoading = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_home-swiper.scss';
</style>
