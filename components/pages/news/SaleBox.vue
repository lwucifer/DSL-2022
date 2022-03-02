<template>
    <div class="sale-box">
        <div class="sale-box__img">
            <n-link :to="`/${defaultLangCode}/sale/detail/${data.id}`"><img :src="data.avatar_small" alt=""></n-link>
        </div>

        <div class="sale-box__content">
            <h5 class="post-name">
                <n-link :to="`/${defaultLangCode}/sale/detail/${data.id}`">{{ data.post_name }}</n-link>
            </h5>

            <div class="mb-16">
                <span class="mb-0">{{$t("sale.time_sale")}}</span>
                <span class="mb-0 deep-dark">{{compareDay}}</span>
            </div>

            <v-button 
                variant="primary" 
                type="a"
                nuxt
                class="w-100"
                :to="`/${defaultLangCode}/sale/detail/${data.id}`"
            >{{$t("sale.watch_now")}}</v-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        data: {
            type: Object,
            default: () => []
        }
    },

    computed: {
        ...mapGetters('common/common', ['defaultLangCode']),

        compareDay() {
            if(this.data.promotions_end) {
                let startPromotion = this.$moment(this.data.promotions_start, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss');

                let endPromotion = this.$moment(this.data.promotions_end, 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss');
                // console.log("endPromotion", typeof endPromotion);

                let currentDay = this.$moment(new Date(), 'DD/MM/YYYY HH:mm:ss').format('YYYY/MM/DD HH:mm:ss');

                // debugger

                if( this.$moment(endPromotion).isAfter(currentDay)) {
                    return this.$moment(this.data.promotions_start, 'DD/MM/YYYY').format('DD/MM/YYYY') + ' - ' + this.$moment(this.data.promotions_end, 'DD/MM/YYYY').format('DD/MM/YYYY');
                }else if( this.$moment(startPromotion).isSame(endPromotion) && this.$moment(endPromotion).isAfter(currentDay)) {
                    return this.data.promotions_start + ' - ' + this.data.promotions_end
                }else {
                    return this.$t("sale.invalid_date")
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/news/_sale-box.scss";
</style>