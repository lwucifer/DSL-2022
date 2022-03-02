<template>
    <div class="point-arrival">
        <div class="point-arrival__title">
            <div>
                <h4>Điểm đến hàng đầu</h4>
                <n-link to="">&#62; Đưa nhau đi trốn !!! &#60;</n-link>
            </div>
            
            <div class="navigation">
                <IconPre class="swiper-prev mr-16"/>
                <IconNext class="swiper-next"/>
            </div>
        </div>

        <div v-swiper:mySwiper="swiperOption" class="care-swiper">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in myData" :key="index">
                    <div class="arrival-item" >
                        <div class="arrival-item__img">
                            <n-link to=""><img :src="item.img" alt=""></n-link>

                            <div class="actions">
                                <span class="icon-heart mr-2" @click="changeActive(item.id)">
                                    <IconHeartActive v-if="item.active == true"/>
                            
                                    <IconHeart v-else/>
                                </span>

                                <a href=""><IconShare/></a>
                            </div>
                        </div>

                        <div class="arrival-item__info">
                            <n-link to="" class="name-arrival">{{ item.name_res }}</n-link>

                            <div>
                                <AppStars stars="4" /> <span>(126)</span>
                            </div>

                            <div class="local-arrival">
                                <IconPin /> {{ item.local }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AppStars from "~/components/app/AppStars"
import IconPin from "~/assets/icons/pin2.svg?inline"
import IconHeart from "~/assets/icons/heart.svg?inline"
import IconHeartActive from "~/assets/icons/heart-2.svg?inline"
import IconNext from "~/assets/icons/right-arrow-2.svg?inline"
import IconPre from "~/assets/icons/left-arrow-2.svg?inline"
import IconShare from "~/assets/icons/share-2.svg?inline"

export default {
    components: {
        AppStars,
        IconPin,
        IconHeart,
        IconHeartActive,
        IconNext,
        IconPre,
        IconShare
    },

    data() {
        return {
            myData: [
                {
                    id: 1,
                    active: true,
                    img: "/images/res-2.png",
                    name_res: "Cung Cá Heo Hạ Long",
                    local: "Trần Quốc Nghiễm - Tuần Châu - TP Hạ Long - TP Móng Cái"
                },

                {
                    id: 2,
                    active: false,
                    img: "/images/res-2.png",
                    name_res: "Bảo tàng TP Móng Cái",
                    local: "Trần Quốc Nghiễm - Tuần Châu - TP Hạ Long - TP Móng Cái"
                },

                {
                    id: 3,
                    active: false,
                    img: "/images/res-2.png",
                    name_res: "Cảng Vân Đồn",
                    local: "Trần Quốc Nghiễm - Tuần Châu - TP Hạ Long - TP Móng Cái"
                },

                {
                    id: 4,
                    active: false,
                    img: "/images/res-2.png",
                    name_res: "Đảo Mắt Rồng Hạ Long",
                    local: "Trần Quốc Nghiễm - Tuần Châu - TP Hạ Long - TP Móng Cái"
                },
            ],

            swiperOption: {
                slidesPerView: 4,
                spaceBetween: 24,
                navigation: {
                    nextEl: '.swiper-next',
                    prevEl: '.swiper-prev'
                },
                autoplay: {
                    delay: 5000,
                },
                loop: true
            }
        }
    },

    methods: {
        changeActive(_id) {
            this.myData.map(i => {
                if (i.id == _id) {
                    i.active = !i.active
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/home/_point-arrival.scss";
</style>