<template>
  <div class="slider-banner">
    <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
            <div class="swiper-slide" :key="item" v-for="item in banners">
                <img :src="item" class="slide-img">
            </div>
        </div>

        <div class="swiper-content">
            <p class="swiper-content__title">Đỉnh <span class="main-text">Everest <span class="stroke">Everest</span></span></p>
            <p class="swiper-content__text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio, voluptatibus?</p>
            <a href="" class="swiper-content__video">
                Watch Video <span><IconPlay class="icon"/></span>
            </a>

            <div class="swiper-content__fraction">
                <IconLeft class="button-prev mr-3"/>
                <span class="fraction">01/05</span>
                <IconRight class="button-next ml-3"/>
            </div>
        </div>

        <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
import IconPlay from "~/assets/icons/play.svg?inline"
import IconLeft from "~/assets/icons/left-arrow.svg?inline"
import IconRight from "~/assets/icons/right-arrow.svg?inline"

export default {
    components: {
        IconPlay,
        IconLeft,
        IconRight
    },

    data() {
        return {
            banners: [
                '/images/swiper-5.png',
            ],

            swiperOption: {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.button-next',
                    prevEl: '.button-prev'
                },
                loop: true,
                autoplay: {
                    delay: 5000,
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_slide-banner-home.scss';
</style>