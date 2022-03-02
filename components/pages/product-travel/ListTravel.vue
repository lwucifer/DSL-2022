<template>
    <div class="container">
        <div class="row">
            <div :class="'col-12 col-md-' + col" v-for="(item, index) in productTravelList" :key="index" @mouseover="$emit('hover', item)" @mouseout="$emit('hover', {})">
                <DestinationBox
                    class="mb-5"
                    type="box"
                    :img-attrs="{
                        src: item.avatar,
                        alt: item.name
                    }"
                    hasPrice
                    :to="`/${defaultLangCode}/tour/detail/${item.tour_id}`"
                    :title="item.name"
                    :rating="item.rate"
                    :ratingCount="item.number_of_rate"
                    :isLiked="!!item.is_favorite"
                    :address="item.start_place"
                    :status="item.status"
                    :product_type="PRODUCT_TYPE"
                    @like="changeFavourite(item.is_favorite, item.id)"
                >
                    <span slot="price">
                        {{$t("hotel.form")}}
                        <b class="primary ml-2"
                        >{{ item.from_price | numeralFormat }} {{ item.currency_code }}</b
                        >
                        /  {{$t("hotel.people")}}
                    </span>
                </DestinationBox>
            </div>
        </div>
    </div>
</template>

<script>
import DestinationBox from '~/components/pages/common/DestinationBox';

import { FAVORITE_ADD, FAVORITE_REMOVE } from '~/utils/endpoints';
import { PRODUCT_TYPE } from '~/utils/constants';
import { mapGetters } from 'vuex';

export default {
    components: {
        DestinationBox
    },

    props: {
        col: {
            type: [String, Number],
            default: 4,
        }
    },

    computed: {
        ...mapGetters('productTravel/productTravel', ['productTravelList']),
        ...mapGetters('auth/auth', ['isAuthenticated']),
        ...mapGetters('common/common', ['defaultLangCode']),
    },

    created() {
        this.PRODUCT_TYPE = Object.freeze(PRODUCT_TYPE);
    },

    methods: {
        changeFavourite(_val, _id) {
            const payload = {
                type: 4,
                id: _id
            };

            if (this.isAuthenticated == true) {
                this.$axios.$post(
                _val ? FAVORITE_REMOVE : FAVORITE_ADD,
                payload
                );
            } else {
                this.$toast.error(this.$t('home.not_login'));
            }
        }
    }
}
</script>
