<template>
    <div class="coupon-combo">
        <div v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper">
                <a :href="item.link" 
                    target="_blank"
                    class="swiper-slide coupon-item" 
                    v-for="(item, index) in data" :key="index"
                    :style="{ 'background-image': 'url(' + item.image + ')' }"
                >
                    <h5 class="coupon-item__title">{{ item.tilte }}</h5>
                    <p class="coupon-item__summary">{{ item.description }}</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
// https://github.com/surmon-china/surmon-china.github.io/blob/source/projects/vue-awesome-swiper/nuxt/swiper.vue

export default {
    data() {
        return {
            swiperOption: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 24,
                loop: true,
                autoplay: {
                    delay: 5000
                },
                navigation: {
                    nextEl: '.swiper-next',
                    prevEl: '.swiper-prev'
                },
                breakpoints: {
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 24
                    },
                    720: {
                        slidesPerView: 3,
                        spaceBetween: 24
                    },
                    540: {
                        slidesPerView: 2,
                        spaceBetween: 15
                    },
                }
            }
        }
    },

    props: {
        data: {
            type: [Object, Array],
            default: () => []
        }

    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_coupon-combo.scss';
</style>
