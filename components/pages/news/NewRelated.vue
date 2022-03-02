<template>
    <div v-swiper:mySwiper="swiperOption" class="home-swiper">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in data" :key="index">
                <NewBox :data="item"/>
            </div>
        </div>

        <div class="swiper-pagination" slot="pagination"></div>
  </div>
</template>

<script>
import NewBox from "~/components/pages/news/NewBox"

export default {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },

    components: {
        NewBox
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
                breakpoints: {
                    720: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                        spaceBetween: 24
                    },
                    540: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
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
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_home-swiper.scss';
</style>