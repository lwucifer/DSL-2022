<template>
  <div class="bg-white pa-16 flex-grow d-flex flex-column">
    <h5 class="mb-16">{{$t("booking.infor_booking_room")}}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.checkin_date")}}</span>
      <span class="primary">{{
        formatDateTime('start', start_date)
      }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.checkout_date")}}</span>
      <span class="primary">{{
        formatDateTime('end', end_date)
      }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.number_room")}}:</span>
      <span class="primary">{{ number_room_booked }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.number_guest")}}:</span>
      <span class="primary">{{ number_person_booked }}</span>
    </div>

    <v-divider />

    <h5 class="mb-16">{{$t("booking.personal_infor")}}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.contact_name")}}</span>
      <span class="primary">{{ customer_name }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("hotel.phone_number")}}</span>
      <span class="primary">{{ customer_phone }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.nationality")}}</span>
      <span class="primary">{{ nationText }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("hotel.email")}}</span>
      <span class="primary">{{ customer_email }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.name_guest")}}:</span>
      <span class="primary">{{ this.is_guest === 'true' ? customer_name : guest_name }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-5">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.note")}}</span>
      <span class="primary">{{ note }}</span>
    </div>

    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button class="booking-actions__back" size="lg" @click="back"
        >{{$t("hotel.back")}}</v-button
      >
      <v-button variant="primary" size="lg" @click="confirm">{{$t("restaurant.confirm")}}</v-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT, DATE_TOUR_DISPLAY_FORMAT } from '~/utils/configs';
import { get } from 'lodash';

export default {
  validate({ query }) {
    return [
      'hotel_id',
      'room_id',
      'total_price',
      'number_room_booked',
      'number_person_booked',
      'number_room_available',
      'start_date',
      'end_date',
      'customer_name',
      'guest_name',
      'is_guest',
      'customer_email',
      'customer_phone',
      'nation_id',
      'note'
    ].every((key) => key in query);
  },

  props: {
    restRoom: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    const {
      hotel_id,
      room_id,
      total_price,
      number_room_booked,
      number_person_booked,
      number_room_available,
      start_date,
      end_date,
      customer_name,
      guest_name,
      is_guest,
      customer_phone,
      nation_id,
      customer_email,
      note
    } = this.$route.query;

    return {
      hotel_id,
      room_id,
      total_price,
      number_room_booked,
      number_person_booked,
      number_room_available,
      start_date,
      end_date,
      customer_name,
      guest_name,
      is_guest,
      customer_phone,
      nation_id,
      customer_email,
      note
    };
  },

  computed: {
    ...mapState('common/common', ['nations']),
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail'
    }),

    nationText() {
      const nation = this.nations.find((item) => item.id === parseInt(this.nation_id));
      return nation ? nation.name : '';
    }
  },

  async fetch() {
    await this.getUtilitiesNation();
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
  },

  methods: {
    ...mapActions('common/common', ['getUtilitiesNation']),

    confirm() {
      this.$router.push(this.localePath({
        path: '/booking/hotel/payment',
        query: this.$route.query
      }));
    },

    formatDateTime (_type, _time) {
      const time = _type === 'start' 
      ? get(this.hotel, 'box_data.checkin_time', '12:00')
      : get(this.hotel, 'box_data.checkout_time', '12:00');
      
      const date = this.$moment(_time, DATE_TIME_FORMAT).format(DATE_TOUR_DISPLAY_FORMAT)

      return `${time} - ${date}`
    },
	
	back() {
       this.$router.push(
        this.localePath({
          path: '/booking/hotel/review',
          query: this.$route.query
        })
      );
    },
  }
};
</script>
