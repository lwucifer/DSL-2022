<template>
  <div class="d-flex flex-column flex-grow">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{$t("booking.choose_payment_method")}}</h5>
      <v-radio-group v-model="paymentMethod" name="paymentMethod">
        <v-radio :value="1" class="mb-16 body-1">
          <span :class="{ primary: paymentMethod === 1 }"
            >{{$t("booking.cash")}}</span
          >
          <span class="body-2"
            >{{$t("booking.pay_cash_to_tour_guide")}}</span
          ></v-radio
        >
        <v-radio :value="2" class="mb-16 body-1">
          <span :class="{ primary: paymentMethod === 2 }"
            >{{$t("booking.pay_atm")}}</span
          >
        </v-radio>
        <!-- <v-radio :value="3" class="mb-0 body-1">
          <span :class="{ primary: paymentMethod === 3 }"
            >{{$t("booking.pay_visa")}}</span
          >
        </v-radio> -->
      </v-radio-group>
    </div>

    <div class="bg-white pa-16 d-flex flex-column flex-grow">
      <h5 class="mb-16">{{$t("booking.personal_infor")}}</h5>

      <div class="d-flex align-items-baseline justify-content-between mb-3">
        <span class="body-1 deep-dark text-nowrap mr-3"
          >{{$t("booking.contact_name")}}</span
        >
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

      <div class="booking-actions mt-auto mr-0 mb-3 d-flex justify-content-end">
        <v-button
          class="booking-actions__back mr-3"
          size="lg"
          @click="back"
          >{{$t("hotel.back")}}</v-button
        >
        <v-button variant="primary" size="lg" @click="modalConfirmBooking = true"
          >{{$t("restaurant.confirm")}}</v-button
        >
      </div>
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
      paymentMethod: 1,
      id,
      person_quantity,
      customer_name,
      customer_phone,
      nation_id: nation_id ? parseInt(nation_id) : 1,
      customer_email,
      booking_date,
      booking_hour,
      note,
      //
      modalConfirmBooking: false
    };
  },

  computed: {
    ...mapState('common/common', ['nations']),
    ...mapState('restaurant/restaurant', {
      restaurant: 'restaurant_detail'
    }),
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

    async booking() {
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

    confirm() {
      if (this.paymentMethod == 1) {
        this.booking();
      }

      if (this.paymentMethod == 2) {
        this.$toast.error(this.$t('booking.payment_not_sup'));
      }

      if (this.paymentMethod == 3) {
        this.$toast.error(this.$t('booking.payment_not_sup'));
      }
    },
	
	back() {
       this.$router.push(
        this.localePath({
          path: '/booking/tour/confirmation',
          query: this.$route.query
        })
      );
    },
  }
};
</script>
