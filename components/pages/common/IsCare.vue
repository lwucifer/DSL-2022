<template>
  <section class="is-care animated fadeIn">
    <div class="is-care__title">
      <slot name="title" />

      <div class="d-flex" v-if="isNavigation">
        <span class="swiper-prev">
          <IconPre />
        </span>
        <span class="swiper-next">
          <IconNext />
        </span>
      </div>
    </div>

    <div v-swiper:mySwiper="swiperOption" class="care-swiper mt-3">
      <div class="swiper-wrapper">
        <slot name="slider-items" />
      </div>
    </div>

    <slot v-if="!data.length" name="empty">
      <div class="text-center">{{$t("hotel.empty_list")}}</div>
    </slot>
  </section>
</template>

<script>
import AppStars from '~/components/app/AppStars';
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconHeart from '~/assets/icons/heart.svg?inline';
import IconHeartActive from '~/assets/icons/heart-2.svg?inline';
import IconNext from '~/assets/icons/next.svg?inline';
import IconPre from '~/assets/icons/pre.svg?inline';
import DestinationBox from '~/components/pages/common/DestinationBox';

export default {
  components: {
    AppStars,
    IconPin,
    IconHeart,
    IconHeartActive,
    IconNext,
    IconPre,
    DestinationBox
  },

  props: {
    isFavourite: {
      type: Boolean,
      default: true
    },

    isNavigation: {
      type: Boolean,
      default: true
    },

    data: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 24,
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev'
        },
        autoplay: {
          delay: 5000
        },
        breakpoints: {
          720: {
            slidesPerView: 3,
            spaceBetween: 24
          },
          540: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          320: {
            slidesPerView: 2,
            spaceBetween: 10
          },
        }
      }
    };
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_is-care.scss';
</style>