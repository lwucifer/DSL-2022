<template>
  <div class="bg-white pa-16">
    <div class="text-center">
      <IconCheckMark />
      <h4 class="mb-16 mt-4">{{ $t('booking.complete_booking_table') }}</h4>
      <p class="body-1 mb-16">
        {{ $t('booking.code_booking_table') }}
        <b class="secondary">{{ order_id }}</b>
      </p>
      <p class="mb-0">{{ $t('booking.keep_contact') }}</p>
      <p class="mb-0">{{ $t('booking.check_email_restaurant') }}</p>
    </div>

    <v-divider class="my-5" />

    <h5 class="mb-16">{{ $t('booking.infor_booking_table') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('booking.location') }}:</span
      >
      <span class="primary">{{ restaurant.name }}</span>
    </div>
    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('booking.address') }}:</span
      >
      <span class="primary">{{ restaurant.address }}</span>
    </div>
    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('booking.booking_time_2') }}:</span
      >
      <span class="primary">
        {{ booking_hour.substring(11, 16) }} -
        {{ booking_date.substring(0, 10) }}</span
      >
    </div>
    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('booking.number_booking') }}:</span
      >
      <span class="primary"
        >{{ person_quantity }} {{ $t('header.guest') }}</span
      >
    </div>

    <div
      v-if="!isAuthenticated && account_type === '0'"
      class="d-flex align-items-baseline justify-content-between mb-5"
    >
      <p class="danger">
        {{ $t('booking.auto_create_email') }} {{ $route.query.customer_email }}.
        {{ $t('booking.check_email') }}
      </p>
    </div>

    <div class="booking-actions mt-auto mr-0 mb-3 d-flex justify-content-end">
      <v-button class="mr-3" variant="secondary" size="lg" nuxt :to="`/${defaultLangCode}`">{{
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
      'person_quantity',
      'booking_date',
      'booking_hour',
      'customer_name',
      'customer_email',
      'customer_phone',
      'nation_id',
      'note',
      'account_type',
    ].every((key) => key in query);
  },

  data() {
    const {
      id,
      person_quantity,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      booking_date,
      booking_hour,
      note,
      order_id,
      account_type
    } = this.$route.query;

    return {
      id,
      person_quantity,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      booking_date,
      booking_hour,
      note,
      order_id,
      account_type
    };
  },

  components: {
    IconCheckMark
  },

  computed: {
    ...mapState('restaurant/restaurant', {
      restaurant: 'restaurant_detail'
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
        this.$router.push(`/${this.defaultLangCode}/account/booking-history`);
      } else {
        this.setModalSignin(true);
        this.setModalAuth(true);
      }
    }
  }
};
</script>
