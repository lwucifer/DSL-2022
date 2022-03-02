<template>
  <div class="bg-white pa-16">
    <div class="text-center">
      <IconCheckMark />
      <h4 class="mb-16 mt-4">{{ $t('booking.complete_booking_hotel') }}</h4>
      <p class="body-1 mb-16">
        {{ $t('booking.code_booking_hotel') }}
        <b class="secondary">{{ transaction.order_id }}</b>
      </p>
      <p class="mb-0">{{ $t('booking.keep_contact') }}</p>
      <p class="mb-0">{{ $t('booking.supplier_will_contact_hotel') }}</p>
    </div>

    <v-divider class="my-5" />

    <h5 class="mb-16">{{ $t('booking.infor_booking_hotel') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3"
        >{{ $t('home.hotel') }}:</span
      >
      <span class="primary">{{ transaction.name }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <!-- <span class="body-1 deep-dark text-nowrap mr-3">Lịch trình:</span>
      <span class="primary"
        >{{ hotel.number_day ? `${hotel.number_day} ngày` : '' }}
        {{ hotel.number_night ? `${hotel.number_night} đêm` : '' }}</span
      > -->
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.checkin_date')
      }}</span>
      <span class="primary">{{ formatDateTime('start', transaction.start_date) }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.checkout_date')
      }}</span>
      <span class="primary">{{ formatDateTime('end', transaction.end_date) }}</span>
    </div>

    <v-divider variant="secondary" />

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.total_2')
      }}</span>
      <b class="primary"
        >{{ transaction.price | numeralFormat }}
        {{ transaction.currency_code }}</b
      >
    </div>

    <div
      v-if="validateEmail"
      class="d-flex align-items-baseline justify-content-between mb-5"
    >
      <p class="danger">
        {{ $t('booking.auto_create_email') }} {{ transaction.customer_email }}.
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
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT, DATE_TOUR_DISPLAY_FORMAT } from '~/utils/configs';
import IconCheckMark from '~/assets/icons/check-mark.svg?inline';
import { get } from "lodash";

export default {
  validate({ query }) {
    return [
      'hotel_id',
      'room_id',
      'total_price',
      'number_room_booked',
      'number_room_available',
      'start_date',
      'end_date',
      'customer_name',
      'customer_email',
      'customer_phone',
      'nation_id',
      'note',
      'order_id',
      'price',
      'currency_code',
      'account_type',
      'name'
    ].every((key) => key in query);
  },

  components: {
    IconCheckMark
  },


  data() {
    const {
      start_date,
      end_date,
      account_type,
      order_id,
      price,
      currency_code,
      customer_email,
      name
    } = this.$route.query;
    return {
      transaction: {
        name,
        customer_email,
        currency_code,
        price,
        start_date,
        end_date,
        account_type,
        order_id
      }
    }
  },

  computed: {
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail'
    }),
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    validateEmail () {
      return !this.isAuthenticated && this.transaction.account_type === '0'
    }
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
  },

  methods: {
    ...mapMutations('common/eventBus', ['setModalSignin', 'setModalAuth']),

    formatDateTime (_type, _time) {
      const time = _type === 'start'
      ? get(this.hotel, 'box_data.checkin_time', '12:00')
      : get(this.hotel, 'box_data.checkout_time', '12:00');
      
      const date = this.$moment(_time, DATE_TIME_FORMAT).format(DATE_TOUR_DISPLAY_FORMAT)

      return `${time} - ${date}`
    },

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