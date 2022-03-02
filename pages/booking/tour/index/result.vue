<template>
  <div class="bg-white pa-16">
    <div class="text-center">
      <IconCheckMark />
      <h4 class="mb-16 mt-4">{{$t("booking.complete_booking_tour")}}</h4>
      <p class="body-1 mb-16">{{$t("booking.code_booking_tour")}} <b class="secondary">{{ $route.query.order_id }}</b></p>
      <p class="mb-0">{{$t("booking.keep_contact")}}</p>
      <p class="mb-0">{{$t("booking.supplier_will_contact_tour")}}</p>
    </div>

    <v-divider class="my-5" />

    <h5 class="mb-16">{{$t("booking.infor_booking_tour")}}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("home.tour")}}:</span>
      <span class="primary">{{ tour.name }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("tour.schedule")}}:</span>
      <span class="primary"
        >{{ tour.number_day ? `${tour.number_day}` +  $t('hotel.day') : '' }}
        {{ tour.number_night ? `${tour.number_night}` +  $t('hotel.night') : '' }}</span
      >
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.start")}}</span>
      <span class="primary">{{ tour.start_place }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-16">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("tour.date_start")}}:</span>
      <span class="primary">{{
        $moment($route.query.start_date, DATE_TIME_FORMAT).format(DATE_DISPLAY_FORMAT)
      }}</span>
    </div>

    <v-divider variant="secondary" />

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.total_2")}}</span>
      <b class="primary">{{ $route.query.price | numeralFormat }} {{ $route.query.currency_code }}</b>
    </div>

    <div v-if="!isAuthenticated && $route.query.account_type === '0'" class="d-flex align-items-baseline justify-content-between mb-5">
      <p class="danger">{{$t("booking.auto_create_email")}} {{ $route.query.customer_email }}. {{$t("booking.check_email")}}</p>
    </div>
    
    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button variant="secondary" size="lg" nuxt :to="`/${defaultLangCode}`"
        >{{$t("booking.discovery_more")}}</v-button
      >
      <v-button variant="primary" size="lg" @click="handleClickBookingManagement"
        >{{$t("booking.manager_booking")}}</v-button
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
      'adults',
      'children',
      'start_date',
      'customer_name',
      'customer_email',
      'customer_phone',
      'nation_id',
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

  computed: {
    ...mapState('tour/tour', {
      tour: 'tourDetail'
    }),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode']),
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
  },

  methods: {
    ...mapMutations('common/eventBus', [
      'setModalSignin',
      'setModalAuth',
    ]),

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
