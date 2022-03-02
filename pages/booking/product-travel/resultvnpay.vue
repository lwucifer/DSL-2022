<template>
<client-only>
  <div class="page-booking-wrapper">
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
                {{ $t('booking.code_booking_product') }}
                <b class="secondary">{{ transaction.order_id }}</b>
              </p>
              <p class="mb-0">{{ $t('payment.content_product_successful_0') }}
                <span class="u-highlight">{{transaction.customer_email}}.</span>
              </p>
              <p class="mb-0">{{ $t('payment.content_product_successful_1') }}</p>
            </div>

            <div class="text-center" v-else>
              <IconCancel width="8rem" height="8rem" />
              <h4 class="mb-16 mt-4">{{ $t('payment.failed') }}</h4>
              <p class="body-1 mb-16">
                {{ $t('booking.code_booking_product') }}
                <b class="secondary">{{ transaction.order_id }}</b>
              </p>
              <p class="mb-0">{{ $t('payment.content_failed') }}</p>
            </div>

            <v-divider class="my-5" />

            <h5 class="mb-16">{{ $t('booking.booking_product_info') }}</h5>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3"
                    >{{ $t('home.product_travel') }}:</span
                >
                <span class="primary">{{ transaction.name }}</span>
            </div>

            <div class="d-flex align-items-baseline justify-content-between mb-16">
                <span class="body-1 deep-dark text-nowrap mr-3"
                    >{{ $t('product.number') }}:</span
                >
                <span class="primary">{{ transaction.quantity }}</span>
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
import { DATE_TIME_FORMAT, DATE_TOUR_DISPLAY_FORMAT } from '~/utils/configs';
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
      transaction: 'productTravelTransaction'
    }),
    ...mapGetters('common/common', [
      'defaultLangCode'
    ]),
    ...mapGetters('auth/auth', ['isAuthenticated'])
  },

  async created () {
    this.setHeaderPaymentSteps([
      {
        text: this.$t('booking.infor'),
        routePath: `/booking/product-travel/review`
      },
      {
        text: this.$t('restaurant.confirm'),
        routePath: `/booking/product-travel/confirmation`
      },
      {
        text: this.$t('booking.payment_method'),
        routePath: `/booking/product-travel/payment`
      },
      {
        text: this.$t('booking.success'),
        routePath: `/booking/product-travel/resultvnpay`
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
