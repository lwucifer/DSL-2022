<template>
  <div v-swiper:mySwiper="swiperOption" class="home-swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in data" :key="index">
        <TourBox
          :img-attrs="{
            src: item.url,
            alt: item.name
          }"
          :isShare="false"
          :title="item.name"
          :rating="item.vote_score"
          :ratingCount="item.vote_number"
          :address="item.address"
          :hasPrice="true"
          :start="item.start_place_name"
          :durationDay="item.number_day"
          :durationNight="item.number_night"
          :destinationCount="item.total_destination"
          :isLiked="!!item.is_favorite"
          :to="`/${defaultLangCode}/tour/detail/${item.id}`"
          :status="item.status"
          @like="handleLike(item.id, item.is_favorite)"
        >
          <span slot="price">
            {{$t("hotel.form")}}
            <b class="primary ml-2"
              >{{ item.from_price | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }}</b
            >
            / {{$t("hotel.people")}}
          </span>
        </TourBox>
      </div>
    </div>

    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PRODUCT_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

import TourBox from '~/components/pages/common/TourBox';

export default {
  components: {
    TourBox
  },

  props: {
    data: {
      type: [Array, Object],
      default: () => []
    }
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 24,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        loop: false,
        autoplay: {
          delay: 5000
        },
        breakpoints: {
          720: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 24
          },
          540: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 15
          },
          320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 10
          },
        }
      },
      likeLoading: false
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode']),
  },

  methods: {
     ...mapActions('home/home', ['postFavorite']),

    async handleLike(id, isLike) {
      if (this.isAuthenticated) {
        if (this.likeLoading) return;
        this.likeLoading = true;

        const result = await this.postFavorite({
          type: PRODUCT_TYPE.TOUR,
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
