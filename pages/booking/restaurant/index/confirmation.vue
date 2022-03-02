<template>
  <div class="bg-white pa-16 flex-grow d-flex flex-column">
    <h5 class="mb-16">{{$t("booking.infor_booking_table")}}</h5>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.date_booking")}}:</span>
      <span class="primary">{{ convertDate(booking_date) }}</span>
    </div>
   
    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.booking_time_2")}}:</span>
      <span class="primary">{{ convertTime(booking_hour) }}</span>
    </div>

    <div class="d-flex align-items-baseline justify-content-between mb-3">
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.number_booking")}}:</span>
      <span class="primary">{{ person_quantity }} {{$t("header.guest")}}</span>
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
      <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.note")}}</span>
      <span class="primary">{{ note }}</span>
    </div>

    <div class="booking-actions mt-auto d-flex justify-content-end">
      <v-button class="booking-actions__back mr" size="lg" @click="back"
        >{{$t("hotel.back")}}</v-button
      >
      <v-button variant="primary" size="lg" class="mr" @click="modalConfirmBooking = true">{{$t("restaurant.confirm")}}</v-button>
    </div>

    <v-modal
      v-model="modalConfirmBooking"
      size="sm"
      :title="$t('booking.confirm_payment')"
      @ok="confirm"
      @cancel="modalConfirmBooking = false"
    >
    <div class="text-center">
      {{$t("booking.booking_table")}}
    </div>
    </v-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT } from '~/utils/configs';
import { PRODUCT_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

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
      'note'
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
      note
    } = this.$route.query;

    return {
      id,
      paymentMethod: 1,
      person_quantity: person_quantity,
      customer_name:customer_name,
      customer_phone:customer_phone,
      nation_id:nation_id,
      customer_email:customer_email,
      booking_date:booking_date,
      booking_hour:booking_hour,
      note:note,
      //
      modalConfirmBooking: false
    };
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
  },

  computed: {
    ...mapState('restaurant/restaurant', {
      restaurant: 'restaurant_detail'
    }),
    ...mapState('common/common', ['nations','checkMailExist']),
    ...mapGetters('common/common', ['defaultLangCode']),

    nationText() {
      const nation = this.nations.find((item) => item.id === parseInt(this.nation_id));
      return nation ? nation.name : '';
    }
  },

  async fetch() {
    await this.getUtilitiesNation();
  },

  methods: {
    ...mapActions('common/common', ['getUtilitiesNation']),
    ...mapActions('booking/booking', ['postBookingRestaurant']),

    async confirm() {
      const result = await this.postBookingRestaurant({
        channel: 'SDL_BKAV_APP',
        payment_type: this.paymentMethod,
        order_type: 1,
        product_type: PRODUCT_TYPE.RESTAURANT,
        product_id: this.restaurant.restaurant_id,
        customer_name: this.customer_name,
        customer_phone: this.customer_phone,
        nation_id: this.nation_id,
        customer_email: this.customer_email,
        note: this.note,
        booking_date: this.booking_date,
        booking_hour: this.booking_hour.substring(11, 16),
        person_quantity: this.person_quantity,
        currency_id: this.$store.state.common.common.defaultCurrency.id
      });

      if (result.code == RES_STATUS_SUCCESS) {
        this.$router.push({
          path: `/${this.defaultLangCode}/booking/restaurant/result`,
          query: { ...this.$route.query, order_id: result.data.order_id_mask}
        });
      } else {
        this.$toast.error(result.message);
      }
    },
	
	back() {
       this.$router.push(
        this.localePath({
          path: '/booking/restaurant/review',
          query: this.$route.query
        })
      );
    },

    convertTime(e) {
      return e.substring(11, 16);
    },

    convertDate(e) {
      return e.substring(0, 10);
    },
  }
};
</script>
