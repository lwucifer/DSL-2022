<template>
  <div class="bg-white pa-16 flex-grow d-flex flex-column">
    <h5 class="mb-16">{{ $t('booking.infor_booking_product') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{ $t('product.number') }}:</span>
      <span class="primary">{{ $route.query.amount || 0 }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{ $t('booking.total_2') }}</span>
      <span class="primary"
        >{{ ($route.query.total_price || 0) | priceTransform(currentExchangeRate) | numeralFormat }}
        {{ defaultCurrency.code }}</span
      >
    </div>

    <v-divider />

    <h5 class="mb-16">{{ $t('booking.personal_infor') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('booking.name_of_consignee') }}:</span
      >
      <span class="primary">{{ $route.query.customer_name || '' }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{ $t('booking.phone_number') }}:</span>
      <span class="primary">{{ $route.query.customer_phone || '' }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">Email:</span>
      <span class="primary">{{ $route.query.customer_email || '' }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{ $t('booking.shipping_address') }}:</span>
      <span class="primary">{{ address }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{ $t('booking.note') }}</span>
      <span class="primary">{{ $route.query.note || '' }}</span>
    </div>

    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button class="booking-actions__back" size="lg" @click="back"
        >{{ $t('hotel.back') }}</v-button
      >
      <v-button variant="primary" size="lg" @click="confirm">{{ $t('restaurant.confirm') }}</v-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  DATE_TIME_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_TOUR_DISPLAY_FORMAT
} from '~/utils/configs';

export default {
  validate({ query }) {
    return [
      'id',
      'amount',
      'customer_name',
      'customer_phone',
      'customer_email',
      'ward',
      'district',
      'city',
      'address',
      'note',
      'get_at_store',
      'total_price',
      'district_code',
      'city_code'
    ].every((key) => key in query);
  },

  computed: {
    ...mapState('common/common', ['defaultCurrency']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
    ]),
    ...mapState('common/selectbox', {
      areaList: 'areas',
      districtList: 'district',
      wardList: 'ward'
    }),

    address() {
      const { city, district, ward, address, get_at_store } = this.$route.query;
      const areaObj =
        city != null
          ? this.areaList.find((item) => item.id === parseInt(city))
          : null;
      const districtObj =
        district != null
          ? this.districtList.find((item) => item.id === parseInt(district))
          : null;
      const wardObj = ward != null ? this.wardList.find(item => item.id === parseInt(ward)) : null;

      const areaText = areaObj ? areaObj.name : '';
      const districtText = districtObj ? districtObj.full_name + ', ' : '';
      const wardText = wardObj ? wardObj.full_name + '. ' : '';
      const addressText =
        get_at_store == 'true' && address
          ? address
          : address
          ? ` (${address})`
          : '';

      return wardText + districtText + areaText + addressText;
    }
  },

  async fetch() {
    const { city_code, district_code } = this.$route.query;

    await Promise.all([
      this.getUtilitiesArea(),
      city_code != null && this.getUtilitiesDistrict({ city_code }),
      district_code != null && this.getUtilitiesWard({ district_code })
    ]);
  },

  methods: {
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesDistrict',
      'getUtilitiesWard'
    ]),

    confirm() {
      this.$router.push(this.localePath({
        path: '/booking/product-travel/payment',
        query: this.$route.query
      }));
    },
	
	back() {
       this.$router.push(
        this.localePath({
          path: '/booking/product-travel/review',
          query: this.$route.query
        })
      );
    },
  }
};
</script>
