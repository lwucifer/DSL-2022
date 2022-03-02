<template>
    <div class="service-ultility">
        <div class="service-ultility__title">{{$t("hotel.convenient_service")}}</div>
        
        <div class="service-ultility__content" v-if="data.length > 0">
            <div class="service-ultility__item text-center" v-for="(item, index) in data" :key="index">
                <img class="img-icon" :src="item.icon" :alt="item.name" :class="item.enable == 0 ? 'disbale' : ''" v-if="item.icon"/>
                <div class="rounded" :class="item.enable == 0 ? 'disbale' : ''" v-else>
                    <IconCard/>
                </div>
                <p class="mb-0">{{item.name}}</p>
            </div>
        </div>
        <div v-else class="mb-2">
           {{$t("hotel.updating")}}
        </div>
    </div>
</template>

<script>
import IconParking from "~/assets/icons/parking.svg?inline"
import IconWifi from "~/assets/icons/wifi.svg?inline"
import IconCard from "~/assets/icons/credit-card.svg?inline"

import { CONVENIENT_SERVICES } from '~/utils/constants';

export default {
    components: {
        IconParking,
        IconWifi,
        IconCard
    },
    
    props: {
        data: {
            type: Array,
            default: []
        }
    },

    methods: {
        iconName (service) {
            switch (service) {
                case CONVENIENT_SERVICES.PARKING.name:
                    return CONVENIENT_SERVICES.PARKING.icon
                    break;
                case CONVENIENT_SERVICES.PAYMENT_CARD.name:
                    return CONVENIENT_SERVICES.PAYMENT_CARD.icon
                    break;
                case CONVENIENT_SERVICES.WIFI.name:
                    return CONVENIENT_SERVICES.WIFI.icon
                    break;
                case CONVENIENT_SERVICES.BILL.name:
                    return CONVENIENT_SERVICES.BILL.icon
                    break;
                default:
                    return CONVENIENT_SERVICES.PAYMENT_CARD.icon
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_service-and-ultility.scss';
</style>