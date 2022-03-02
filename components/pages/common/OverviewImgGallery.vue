<template>
  <div class="overview-img-gallery">
    <div
      v-swiper:swiperTop="swiperTopOption"
      class="overview-img-gallery__swiper-top"
    >
      <div class="swiper-wrapper">
        <div
          class="swiper-slide text-center"
          v-for="(item, index) in images"
          :key="index"
        >
          <img :src="item.url" alt="" />
        </div>
      </div>

      <div class="swiper-pagination"></div>

      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <div
      v-swiper:swiperThumbs="swiperThumbsOption"
      class="overview-img-gallery__swiper-thumb"
    >
      <div class="swiper-wrapper">
        <div
          class="swiper-slide text-center"
          v-for="(item, index) in images"
          :key="index"
        >
          <span><img :src="item.url" alt="" /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) => ['url', 'type'].every((key) => key in item))
    },
    defaultIndex: Number
  },

  data() {
    return {
      swiperTopOption: {
        spaceBetween: 16,
        slidesPerView: 1,
        loopedSlides: 5,
        loop: true,
        autoHeight: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        breakpoints: {
          1247: {
            loop: true,
            loopedSlides: 5,
          },
          991: {
            loop: true,
            loopedSlides: 4,
          },
          767: {
            loop: true,
            loopedSlides: 3,
          }
        }
      },
      swiperThumbsOption: {
        spaceBetween: 16,
        slidesPerView: 5,
        loop: true,
        loopedSlides: 5,
        centeredSlides: true,
        updateOnWindowResize: true,
        slideToClickedSlide: true,
        breakpoints: {
          1247: {
            spaceBetween: 8,
            loop: true,
            loopedSlides: 5,
          },
          991: {
            slidesPerView: 4,
            spaceBetween: 8,
            loop: true,
            loopedSlides: 4,
          },
          767: {
            slidesPerView: 3,
            spaceBetween: 8,
            loop: true,
            loopedSlides: 3,
          }
        }
      }
    };
  },

  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.swiperTop;
      const swiperThumbs = this.swiperThumbs;
      swiperTop.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiperTop;

      this.swiperTop.slideToLoop(this.defaultIndex || 0);
    });

    window.addEventListener('resize', this.updateSwiper);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateSwiper);
  },

  watch: {
    defaultIndex(newValue) {
      this.swiperTop.slideToLoop &&
        this.swiperTop.slideToLoop(this.defaultIndex || 0);
      this.updateSwiper();
    }
  },

  methods: {
    updateSwiper() {
      this.swiperTop.update();
      this.swiperThumbs.update();
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_overview-img-gallery.scss';
</style>