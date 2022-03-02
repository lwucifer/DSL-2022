<template>
  <div class="bg-white pa-16">
    <div class="text-center">
      <IconCheckMark />
      <h4 class="mb-16 mt-4">{{ $t('booking.complete_booking_product') }}</h4>
      <p class="body-1 mb-16">
        {{ $t('booking.code_booking_product') }}:
        <b class="secondary">{{ $route.query.order_id }}</b>
      </p>
      <p class="mb-0">{{ $t('booking.keep_contact') }}</p>
      <p class="mb-0">
        {{ $t('booking.supplier_contact_confirm_product') }}
      </p>
    </div>

    <v-divider class="my-5" />

    <h5 class="mb-16">{{ $t('booking.booking_product_info') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('home.product_travel') }}:</span
      >
      <span class="primary">{{ productName }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('product.number') }}:</span
      >
      <span class="primary">{{ $route.query.amount || 0 }}</span>
    </div>

    <v-divider variant="secondary" />

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.total_2')
      }}</span>
      <b class="primary"
        >{{ $route.query.price | numeralFormat }}
        {{ $route.query.currency_code }}</b
      >
    </div>

    <div
      v-if="!isAuthenticated && $route.query.account_type === '0'"
      class="d-flex align-items-baseline justify-content-between mb-5"
    >
      <p class="danger">
        {{ $t('booking.auto_create_email') }} {{ $route.query.customer_email }}.
        {{ $t('booking.check_email') }}
      </p>
    </div>

    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button variant="secondary" size="lg" nuxt :to="`/${defaultLangCode}`">{{
        $t('booking.discovery_more')
      }}</v-button>
      <v-button
        variant="primary"
        size="lg"
        @click="handleClickBookingManagement"
        >{{ $t('booking.manager_booking') }}</v-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT } from '~/utils/configs';
import IconCheckMark from '~/assets/icons/check-mark.svg?inline';

export default {
  validate({ query }) {
    return [
      'id',
      'amount',
      'customer_email',
      'note',
      'order_id',
      'price',
      'currency_code',
      'account_type'
    ].every((key) => key in query);
  },

  components: {
    IconCheckMark
  },

  props: {
    productName: {
      type: String,
      default: ''
    }
  },

  computed: {
    ...mapGetters('productTravel/productTravel', {
      product: 'productTravelDetail'
    }),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode']),

  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
  },

  methods: {
    ...mapMutations('common/eventBus', ['setModalSignin', 'setModalAuth']),

    handleClickBookingManagement() {
      if (this.isAuthenticated) {
        this.$router.push(this.localePath('/account/booking-history'));
      } else {
        this.setModalSignin(true);
        this.setModalAuth(true);
      }
    }
  }
};
</script>
