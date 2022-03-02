<template>
  <div class="bg-white pa-16 flex-grow d-flex flex-column">
    <h5 class="mb-16">{{ $t('booking.infor_booking_tour') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('tour.date_start')
      }}</span>
      <span class="primary">{{
        $moment(start_date, DATE_TIME_FORMAT).format(DATE_TOUR_DISPLAY_FORMAT)
      }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.number_adult')
      }}</span>
      <span class="primary">{{ adults }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.number_child')
      }}</span>
      <span class="primary">{{ children }}</span>
    </div>

    <v-divider />

    <h5 class="mb-16">{{ $t('booking.personal_infor') }}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.contact_name')
      }}</span>
      <span class="primary">{{ customer_name }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('hotel.phone_number')
      }}</span>
      <span class="primary">{{ customer_phone }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.nationality')
      }}</span>
      <span class="primary">{{ nationText }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('hotel.email')
      }}</span>
      <span class="primary">{{ customer_email }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{
        $t('booking.note')
      }}</span>
      <span class="primary">{{ note }}</span>
    </div>

    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button
        class="booking-actions__back"
        size="lg"
        @click="back"
        >{{ $t('hotel.back') }}</v-button
      >
      <v-button variant="primary" size="lg" @click="confirm">{{
        $t('restaurant.confirm')
      }}</v-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  DATE_TIME_FORMAT,
  DATE_DISPLAY_FORMAT,
  DATE_TOUR_DISPLAY_FORMAT
} from '~/utils/configs';

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
      'account_type'
    ].every((key) => key in query);
  },

  props: {
    schedule: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    const {
      id,
      children,
      adults,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      note = '',
      start_date
    } = this.$route.query;

    return {
      id,
      children,
      adults,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      note,
      start_date
    };
  },

  computed: {
    ...mapState('common/common', ['nations']),

    nationText() {
      const nation = this.nations.find(
        (item) => item.id === parseInt(this.nation_id)
      );
      return nation ? nation.name : '';
    }
  },

  async fetch() {
    await this.getUtilitiesNation();
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
    this.DATE_TOUR_DISPLAY_FORMAT = DATE_TOUR_DISPLAY_FORMAT;
  },

  methods: {
    ...mapActions('common/common', ['getUtilitiesNation']),

    confirm() {
      this.$router.push(
        this.localePath({
          path: '/booking/tour/payment',
          query: this.$route.query
        })
      );
    },
	
	back() {
       this.$router.push(
        this.localePath({
          path: '/booking/tour/review',
          query: this.$route.query
        })
      );
    },
  }
};
</script>
