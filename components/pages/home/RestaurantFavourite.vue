<template>
  <div v-swiper:mySwiper="swiperOption" class="home-swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in data" :key="index">
        <DestinationBox
          :img-attrs="{
            src: item.url,
            alt: item.name
          }"
          :isShare="false"
          :isLiked="!!item.is_favorite"
          :title="item.name"
          :rating="item.vote_score"
          :ratingCount="item.vote_number"
          :address="item.address"
          :hasPrice="true"
          :to="`/${defaultLangCode}/restaurant/detail/${item.id}`"
          :product_type='type'
          :product_id='item.id'
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
        </DestinationBox>
      </div>
    </div>

    <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PRODUCT_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

import DestinationBox from '~/components/pages/common/DestinationBox';
export default {
  components: {
    DestinationBox
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

      type: PRODUCT_TYPE.RESTAURANT
    };
  },

  computed: {
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode']),
    ...mapGetters('auth/auth', ['isAuthenticated'])
  },

  methods: {
    ...mapActions('home/home', ['postFavorite']),

    async handleLike(id, isLike) {
      if (this.isAuthenticated) {
        if (this.likeLoading) return;
        this.likeLoading = true;

        const result = await this.postFavorite({
          type: PRODUCT_TYPE.RESTAURANT,
          id: id,
          isFavorite: isLike ? 0 : 1
        });

        const actionName = isLike ?  this.$t("home.delete") : this.$t("home.save");
        if (result.code == RES_STATUS_SUCCESS) {
          isLike &&
           this.$toasted.success(`${actionName} ` + this.$t('home.from_list_favourite'));
          !isLike &&
            this.$toasted.success(`${actionName} ` + this.$t('home.to_list_favourite'));

            this.$emit('reload');
        } else {
          this.$toasted.error(`${actionName} ` + this.$t('home.failed'));
        }
  
        this.likeLoading = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    }
  }

}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_home-swiper.scss';
</style>
