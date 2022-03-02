<template>
  <div class="d-flex flex-column flex-grow">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{ $t('booking.choose_payment_method') }}</h5>
      <v-radio-group v-model="paymentMethod" name="paymentMethod">
        <v-radio :value="1" class="mb-16 body-1">
          <span :class="{ primary: paymentMethod === 1 }">{{
            $t('booking.cash')
          }}</span></v-radio
        >
        <v-radio :value="2" class="mb-16 body-1">
          <span :class="{ primary: paymentMethod === 2 }">{{
            $t('booking.pay_atm')
          }}</span>
        </v-radio>
        <!-- <v-radio :value="3" class="mb-0 body-1">
          <span :class="{ primary: paymentMethod === 3 }">{{
            $t('booking.pay_visa')
          }}</span>
        </v-radio> -->
      </v-radio-group>
    </div>

    <div class="bg-white pa-16 d-flex flex-column flex-grow">
      <h5 class="mb-16">{{ $t('booking.personal_infor') }}</h5>

      <div class="d-flex align-items-baseline justify-content-between mb-3">
        <span class="body-1 deep-dark text-nowrap mr-3">{{
          $t('booking.contact_name')
        }}</span>
        <span class="primary">{{ name }}</span>
      </div>

      <div class="d-flex align-items-baseline justify-content-between mb-3">
        <span class="body-1 deep-dark text-nowrap mr-3">{{
          $t('hotel.phone_number')
        }}</span>
        <span class="primary">{{ phone }}</span>
      </div>

      <div class="d-flex align-items-baseline justify-content-between mb-3">
        <span class="body-1 deep-dark text-nowrap mr-3">Email:</span>
        <span class="primary">{{ email }}</span>
      </div>

      <div class="d-flex align-items-baseline justify-content-between mb-3">
        <span class="body-1 deep-dark text-nowrap mr-3"
          >{{ $t('booking.shipping_address') }}:</span
        >
        <span class="primary">{{ addressText }}</span>
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
        <v-button
          variant="primary"
          size="lg"
          @click="modalConfirmBooking = true"
          >{{ $t('restaurant.confirm') }}</v-button
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
      <div class="text-center">{{ $t('booking.confirm_booking_product') }}</div>
    </v-modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { PRODUCT_TYPE, PAYMENT_TYPE, ORDER_TYPE } from '~/utils/constants';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

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

  data() {
    const {
      amount = 0,
      customer_name = '',
      customer_phone = '',
      customer_email = '',
      ward = null,
      district = null,
      city = null,
      address = '',
      get_at_store = null,
      note = ''
    } = this.$route.query;

    return {
      paymentMethod: 1, 
      //
      amount: amount ? parseInt(amount) : 0,
      name: customer_name,
      phone: customer_phone,
      email: customer_email,
      ward: ward ? parseInt(ward) : null,
      district: district ? parseInt(district) : null,
      city: city ? parseInt(city) : null,
      address,
      getAtStore: get_at_store == 'true',
      note,
      //
      modalConfirmBooking: false
    };
  },

  computed: {
    ...mapState('common/common', ['nations', 'defaultCurrency']),
    ...mapState('common/selectbox', {
      areaList: 'areas',
      districtList: 'district',
      wardList: 'ward'
    }),
    ...mapGetters('productTravel/productTravel', {
      product: 'productTravelDetail'
    }),
    ...mapGetters('common/common', [
      'defaultLangCode'
    ]),

    addressText() {
      const { city, district, ward, address, get_at_store } = this.$route.query;
      const areaObj =
        city != null
          ? this.areaList.find((item) => item.id === parseInt(city))
          : null;
      const districtObj =
        district != null
          ? this.districtList.find((item) => item.id === parseInt(district))
          : null;
      const wardObj =
        ward != null
          ? this.wardList.find((item) => item.id === parseInt(ward))
          : null;

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

  created() {
    this.PAYMENT_TYPE = Object.freeze(PAYMENT_TYPE);
  },

  methods: {
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesDistrict',
      'getUtilitiesWard'
    ]),
    ...mapActions('booking/booking', [
      'postBookingProduct',
      'createPayURL'
    ]),

    async booking() {
      const result = await this.postBookingProduct({
        channel: 'SDL_BKAV_APP',
        paymentType: this.paymentMethod,
        orderType: ORDER_TYPE.RETAIL,
        orderStatus: 0, // default is 0
        productType: PRODUCT_TYPE.PRODUCT,
        productId: this.product.productId,
        customerName: this.name,
        customerPhone: this.phone,
        customerEmail: this.email,
        note: this.note,
        currencyId: this.$store.state.common.common.defaultCurrency.id,
        quantity: this.amount,
        provinceId: this.getAtStore ? null : this.city,
        districtId: this.getAtStore ? null : this.district,
        wardId: this.getAtStore ? null : this.ward,
        address: this.address,
        receiveType: this.getAtStore ? 2 : 1
      });

      if (result.code == RES_STATUS_SUCCESS) {
        const { orderIdMask, price, currencyCode, trans_id, vndPrice } = result.data;

        if (this.paymentMethod === PAYMENT_TYPE.CASH) {
          this.$router.push(this.localePath({
            path: '/booking/product-travel/result',
            query: {
              ...this.$route.query,
              order_id: orderIdMask,
              price,
              currency_code: currencyCode /* some infomation follow */
            }
          }));
        } else {
          const payload = {
            txnRef: trans_id,
            orderInfo: 'Payment product travel',
            orderType: '17000', // https://sandbox.vnpayment.vn/apis/docs/loai-hang-hoa/
            amount: vndPrice,
            callbackUrl: `${process.env.BASE_ORIGIN_LOCATION}/${this.defaultLangCode}/booking/product-travel/resultvnpay`
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

    // confirm() {
    //   if (this.paymentMethod == 1) {
    //     this.booking({
    //       paymentType: PAYMENT_TYPE.CASH
    //     });
    //   }

    //   if (this.paymentMethod == 2) {
    //     this.$toast.error(this.$t('booking.payment_not_sup'));
    //   }

    //   if (this.paymentMethod == 3) {
    //     this.$toast.error(this.$t('booking.payment_not_sup'));
    //   }
    // },
	
	  back() {
       this.$router.push(
        this.localePath({
          path: '/booking/product-travel/confirmation',
          query: this.$route.query
        })
      );
    }
  }
};
</script>
