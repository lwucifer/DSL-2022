<template>
  <div class="slider-banner">
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in banners" :key="index">
          <img :src="item.image" class="slide-img" />
        </div>
      </div>

      <div class="swiper-content">
        <p class="swiper-content__title text-center">{{$t('home.travel_deck')}}</p>
        <p class="swiper-content__text">
         {{$t("home.discovery_preorder_travel")}}
        </p>
      </div>

      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    banners: {
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
        loop: true,
        autoplay: {
          delay: 5000
        },
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_slider-banner.scss';
</style>
