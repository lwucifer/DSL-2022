<template>
  <div class="row">
    <div
      class="col-6 col-md-4 mb-24"
      :class="`col-xl-${col}`"
      v-for="(item, index) in list"
      :key="index"
      @mouseover="$emit('hover', item)"
      @mouseout="$emit('hover', {})"
    >
      <DestinationBox
        type="box"
        :img-attrs="{
          src: get(item,'default_thumbnail',''),
          alt: get(item,'name','')
        }"
        isShare
        hasPrice
        :isAddable="true"
        :priceRed="get(item,'discount','')"
        :to="renderLink(propType, item)"
        :title="get(item,'name','')"
        :rating="get(item,'rate','')"
        :ratingCount="get(item,'number_of_rate','')"
        :isLiked="!!get(item,'is_favorite',0)"
        :address="get(item,'address','')"
        :status="get(item,'status','')"
        :product_type="propType"
        :product_id="renderID(propType, item)"
      >
        <div slot="price" v-if="get(item,'from_price','')">
          {{$t("hotel.form")}} <span class="color-primary"> {{get(item,'from_price','') | priceTransform(currentExchangeRate) | numeralFormat}} {{currentUnitCode}} </span>/ {{$t("hotel.people")}}
        </div>
      </DestinationBox>
    </div>
    <div class="col-12 mb-5 animated fadeIn" v-if="!get(list, 'length', 0) && loaded"><NotFound/></div>
  </div>
</template>

<script>
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconShare from '~/assets/icons/share.svg?inline';
import IconHeart from '~/assets/icons/heart.svg?inline';
import IconHeartActive from '~/assets/icons/heart-2.svg?inline';
import DestinationBox from '~/components/pages/common/DestinationBox';
import SearchNoResult from '~/components/pages/common/SearchNoResult';
import { PRODUCT_TYPE } from '~/utils/constants';
import NotFound from '~/components/pages/common/NotFound';
import {get} from 'lodash'

import { mapGetters } from 'vuex';

export default {
  components: {
    DestinationBox,
    SearchNoResult,
    IconPin,
    IconShare,
    IconHeart,
    IconHeartActive,
    NotFound
  },

  props: {
    list: {
      type: [Array, Object],
      default: []
    },
    col: {
      type: [String, Number],
      default: 4
    },
    propType: {
      type: [String, Number],
      default: PRODUCT_TYPE.RESTAURANT
    },
    loaded: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
		PRODUCT_TYPE,
    };
  },

  computed: {
    ...mapGetters('restaurant/restaurant', ['isFetchingList']),
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode'])
  },

  methods: {
	get,
    renderLink(value, item) {
      const {category_id} = this.$route.params;
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return `/${this.defaultLangCode}/hotel/detail/${get(item,'hotel_id', 0)}`;
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return `/${this.defaultLangCode}/restaurant/detail/${get(item,'restaurant_id', 0)}`;
          break;
      }
    },
    renderID(value, item) {
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return get(item,'hotel_id', 0);
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return get(item,'restaurant_id', 0);
          break;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/restaurant/_list-retaurant.scss';
</style>
