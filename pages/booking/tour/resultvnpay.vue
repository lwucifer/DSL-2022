<template>
<client-only>
  <div class="my-24">
    <div class="container">
      <div class="row">
        <div
          class="d-flex flex-column col-12"
        >
          <div class="bg-white pa-16">
            <div class="text-center" v-if="transaction.payment_status === 1">
              <IconCheckMark />
              <h4 class="mb-16 mt-4">{{ $t('payment.successful') }}</h4>
              <p class="body-1 mb-16">
                {{ $t('booking.code_booking_tour') }}
                <b class="secondary">{{ transaction.order_id }}</b>
              </p>
              <p class="mb-0">{{ $t('payment.content_tour_successful_0') }}
                <span class="u-highlight">{{transaction.customer_email}}.</span>
              </p>
              <p class="mb-0">{{ $t('payment.content_tour_successful_1') }}</p>
            </div>

            <div class="text-center" v-else>
              <IconCancel width="8rem" height="8rem" />
              <h4 class="mb-16 mt-4">{{ $t('payment.failed') }}</h4>
              <p class="body-1 mb-16">
                {{ $t('booking.code_booking_tour') }}
                <b class="secondary">{{ transaction.order_id }}</b>
              </p>
              <p class="mb-0">{{ $t('payment.content_failed') }}</p>
            </div>

            <v-divider class="my-5" />

            <h5 class="mb-16">{{$t("booking.infor_booking_tour")}}</h5>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3">{{$t("home.tour")}}:</span>
                <span class="primary">{{ transaction.name }}</span>
            </div>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3">{{$t("tour.schedule")}}:</span>
                <span class="primary"
                    >{{ transaction.number_day ? `${transaction.number_day}` +  $t('hotel.day') : '' }}
                    {{ transaction.number_night ? `${transaction.number_night}` +  $t('hotel.night') : '' }}</span
                >
            </div>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3">{{$t("booking.start")}}</span>
                <span class="primary">{{ transaction.start_place }}</span>
            </div>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3">{{$t("tour.date_start")}}:</span>
                <span class="primary">{{
                    $moment(transaction.start_date, DATE_TIME_FORMAT).format(DATE_DISPLAY_FORMAT)
                }}</span>
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
              v-if="!isAuthenticated"
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
        </div>
      </div>
    </div>
  </div>
</client-only>
  
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT, DATE_TOUR_DISPLAY_FORMAT } from '~/utils/configs';
import IconCheckMark from '~/assets/icons/check-mark.svg?inline';
import IconCancel from '~/assets/icons/cancel.svg?inline';

import { get } from "lodash";

export default {
  layout: 'payment',
  validate({ query }) {
    return [
      'vnp_Amount',
      'vnp_BankCode',
      'vnp_CardType',
      'vnp_OrderInfo',
      'vnp_PayDate',
      'vnp_ResponseCode',
      'vnp_TmnCode',
      'vnp_TransactionNo',
      'vnp_TxnRef',
      'vnp_SecureHashType',
      'vnp_SecureHash'
    ].every((key) => key in query);
  },

  scrollToTop: true,

  components: {
    IconCheckMark,
    IconCancel
  },

  async fetch() {
    try {
      const { vnp_TxnRef } = this.$route.query;
      const result = await this.getTransactionDetail({
        trans_id: vnp_TxnRef
      });

      if (result.error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        throw new Error(result.error.message);
        return;
      }
    } catch (error) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error(error.message);
    }
  },

  computed: {
    ...mapGetters('booking/booking', {
      transaction: 'tourTransaction'
    }),
    ...mapGetters('common/common', [
      'defaultLangCode'
    ]),
    ...mapGetters('auth/auth', ['isAuthenticated'])
  },

  async created () {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
    
    this.setHeaderPaymentSteps([
      {
        text: this.$t('booking.infor'),
        routePath: `/booking/tour/review`
      },
      {
        text: this.$t('restaurant.confirm'),
        routePath: `/booking/tour/confirmation`
      },
      {
        text: this.$t('booking.payment_method'),
        routePath: `/booking/tour/payment`
      },
      {
        text: this.$t('booking.success'),
        routePath: `/booking/tour/resultvnpay`
      }
    ])
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  },

  beforeDestroy() {
    window &&
      window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    this.setHeaderPaymentSteps([]);
  },

  methods: {
    ...mapActions('booking/booking', ['getTransactionDetail']),
    ...mapMutations('common/headerPayment', ['setHeaderPaymentSteps']),

    handleWindowBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = '';
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

<style lang="scss">
@import '~/assets/scss/pages/_booking.scss';
</style>
