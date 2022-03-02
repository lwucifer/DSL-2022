<template>
  <div class="d-flex flex-column flex-grow">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{$t("booking.choose_payment_method")}}</h5>
      <v-radio-group v-model="paymentMethod" name="paymentMethod">
        <v-radio :value="1" class="mb-16 body-1">
          <span :class="{ primary: paymentMethod === 1 }"
            >{{$t("booking.payment_checkin")}}</span
          >
          <!-- <span class="body-2"
            >(Quý khách sẽ thanh toán bằng tiền mặt cho Hướng dẫn viên du lịch
            hướng dẫn tour.)</span
          > -->
          </v-radio
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
        <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.name_guest")}}:</span>
        <span class="primary">{{
          this.is_guest === 'true' ? customer_name : guest_name
        }}</span>
      </div>

      <div class="d-flex align-items-baseline justify-content-between mb-5">
        <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.note")}}</span>
        <span class="primary">{{ note }}</span>
      </div>

      <div class="booking-actions mt-auto d-flex justify-content-end">
        <v-button
          class="booking-actions__back"
          size="lg"
          @click="back"
          >{{$t("hotel.back")}}</v-button
        >
        <v-button
          variant="primary"
          size="lg"
          @click="modalConfirmBooking = true"
          >{{$t("restaurant.confirm")}}</v-button
        >
      </div>
    </div>

    <v-modal
      v-model="modalConfirmBooking"
      size="sm"
      :title="$t('booking.confirm_payment')"
      @ok="booking"
      @cancel="modalConfirmBooking = false"
    >
      <div class="text-center">{{$t("booking.conduct_booking_hotel")}}</div>
    </v-modal>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { PRODUCT_TYPE, PAYMENT_TYPE, ORDER_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { POST_PRODUCT_TRAVEL_BOOKING } from '~/utils/action-type/productTravel';
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
      paymentMethod: 1,
      //
      hotel_id,
      room_id,
      total_price,
      number_room_booked,
      number_person_booked,
      number_room_available,
      start_date,
      end_date,
      nation_id: nation_id ? parseInt(nation_id) : 1,
      customer_name,
      guest_name,
      is_guest,
      customer_phone,
      customer_email,
      note,
      //
      modalConfirmBooking: false
    };
  },

  computed: {
    ...mapState('common/common', ['nations']),
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail'
    }),
    ...mapGetters('common/common', [
      'defaultLangCode'
    ]),

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
    ...mapActions('booking/booking', [
      'postBookingHotel',
      'createPayURL'
    ]),

    async booking() {
      const result = await this.postBookingHotel({
        channel: 'SDL_BKAV_APP',
        payment_type: this.paymentMethod,
        order_type: ORDER_TYPE.RETAIL,
        order_status: 0, // default is 0
        product_type: PRODUCT_TYPE.HOTEL,
        product_id: this.hotel_id,
        customer_id: 6,
        customer_name: this.customer_name,
        customer_phone: this.customer_phone,
        nation_id: this.nation_id,
        customer_email: this.customer_email,
        note: this.note,
        room_id: this.room_id,
        quantity: parseInt(this.number_room_booked),
        person_quantity: parseInt(this.number_person_booked),
        checkin: this.start_date,
        checkout: this.end_date,
        currency_id: this.$store.state.common.common.defaultCurrency.id,
        guest_stay: this.is_guest === 'true' ? 1 : 0,

        guest_name: this.guest_name
      });

      if (result.code == RES_STATUS_SUCCESS) {
        const { order_id_mask, price, currency_code, trans_id, vndPrice } = result.data;
 
        if (this.paymentMethod === PAYMENT_TYPE.CASH) {
          this.$router.push(this.localePath({
            path: '/booking/hotel/result',
            query: {
              ...this.$route.query,
              order_id: order_id_mask,
              name: get(this.hotel, 'name', ''),
              price,
              currency_code
            }
          }));
        } else {
          const payload = {
            txnRef: trans_id,
            orderInfo: 'Payment hotel',
            orderType: '17000', // https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/
            amount: vndPrice,
            callbackUrl: `${process.env.BASE_ORIGIN_LOCATION}/${this.defaultLangCode}/booking/hotel/resultvnpay`
          }
          // https://api.nghenhanvietnam.vn/bkav-sdl/api/payment/vnp/createPayUrl
          const payment = await this.createPayURL(payload)
          if (payment.code == RES_STATUS_SUCCESS) {
            const link = document.createElement('a');
            link.href = payment.data;
            document.body.appendChild(link);
            link.click();
          } else {
            this.$toast.error(payment.message);
          }
        }
      } else {
        this.$toast.error(result.message);
      }
    },

	  back() {
       this.$router.push(
        this.localePath({
          path: '/booking/hotel/confirmation',
          query: this.$route.query
        })
      );
    },
  }
};
</script>
