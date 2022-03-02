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
          src: get(item, 'default_thumbnail', ''),
          alt: get(item, 'name', '')
        }"
        isShare
        hasPrice
        :isAddable="true"
        :priceRed="get(item, 'discount', '')"
        :to="renderLink(propType, item)"
        :title="get(item, 'name', '')"
        :rating="
          get(item, propType == PRODUCT_TYPE.HOTEL ? 'vote' : 'rate', '')
        "
        :ratingCount="
          get(
            item,
            propType == PRODUCT_TYPE.HOTEL ? 'number_votes' : 'number_of_rate',
            0
          )
        "
        :isLiked="!!get(item, 'is_favorite', 0)"
        :address="get(item, 'address', '')"
        :product_type="propType"
        :product_id="renderID(propType, item)"
        :disabled="get(item, 'status', '') === PRODUCT_STATUS.DISABLED"
        :status="get(item, 'status', '')"
        :hasLevel="true"
        :level="get(item, 'rank')"
      >
        <div slot="price" v-if="get(item, 'price', '')">
          {{ $t('hotel.form') }}
          <span class="color-primary">
            {{
              get(item, 'price', '')
                | priceTransform(currentExchangeRate)
                | numeralFormat
            }}
            {{ currentUnitCode }} </span
          >/ {{ $t('hotel.night') }}
        </div>
      </DestinationBox>
    </div>

    <div class="col-12 mb-5 animated fadeIn" v-if="!get(list, 'length', 0) && loaded">
      <NotFound />
    </div>
  </div>
</template>

<script>
import NotFound from '~/components/pages/common/NotFound';
import DestinationBox from '~/components/pages/common/DestinationBox';

import { mapGetters, mapActions } from 'vuex';
import { PRODUCT_TYPE } from '~/utils/constants';
import { convertQueryValue } from '~/utils/common';
import { PRODUCT_STATUS } from '~/utils/constants';
import { get } from 'lodash';

export default {
  components: {
    NotFound,
    DestinationBox
  },

  props: {
    col: {
      type: [String, Number],
      default: 4
    },
    propType: {
      type: [String, Number],
      default: PRODUCT_TYPE.HOTEL
    },
    loaded: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      PRODUCT_STATUS,
      PRODUCT_TYPE,
      likeLoading: false,
      type: PRODUCT_TYPE.HOTEL,
      checkin_time: null,
      checkout_time: null,
	  check_loaded: false
    };
  },

  computed: {
    ...mapGetters('hotel/hotel', [
      'hotelList',
      'hotelPagination',
      'isFetchingList',
      'totalHotel'
    ]),
    ...mapGetters('restaurant/restaurant', ['restaurantList']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    list() {
      if (this.propType == PRODUCT_TYPE.RESTAURANT) return this.restaurantList;
      if (this.propType == PRODUCT_TYPE.HOTEL) return this.hotelList;
      return [];
    }
  },

  methods: {
    get,
    ...mapActions('hotel/hotel', ['postHotelFavorite']),
    renderLink(value, item) {
      const { category_id } = this.$route.params;
      const { checkin_time, checkout_time } = this.$route.query;
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          const from = !!checkin_time ? `?checkin_time=${checkin_time}` : '';
          const to = !!checkout_time ? `&checkout_time=${checkout_time}` : '';
          return `/${this.defaultLangCode}/hotel/detail/${get(
            item,
            'hotel_id',
            0
          )}${from}${to}`;

          break;
        case PRODUCT_TYPE.RESTAURANT:
          return `/${this.defaultLangCode}/restaurant/detail/${get(
            item,
            'restaurant_id',
            0
          )}`;
          break;
      }
    },
    renderID(value, item) {
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return get(item, 'hotel_id', 0);
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return get(item, 'restaurant_id', 0);
          break;
      }
    },

    async changeActive(hotelId, isLike) {
      if (this.isAuthenticated) {
        if (this.likeLoading) return;
        this.likeLoading = true;

        const doLike = await this.postHotelFavorite({
          type: PRODUCT_TYPE.HOTEL,
          id: hotelId,
          isFavorite: isLike ? 0 : 1
        });

        this.$toast.global.primary(
          isLike
            ? this.$t('home.delete') + this.$t('home.from_list_favourite')
            : this.$t('home.save') + this.$t('home.to_list_favourite')
        );

        this.likeLoading = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    }
  },
  watch: {
	loaded(){
	  this.check_loaded = true;
	},
	
    '$route.query': {
      immediate: true,
      handler(query) {
        this.checkin_time = convertQueryValue(
          query,
          'checkin_time',
          this.$moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
        );
        this.checkout_time = convertQueryValue(query, 'checkout_time', null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/restaurant/_list-retaurant.scss';
</style>
