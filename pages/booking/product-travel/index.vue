<template>
  <client-only>
    <div class="page-booking-wrapper">
      <div class="container">
        <div class="row">
          <div
            v-if="!$route.path.includes('/booking/product-travel/result')"
            class="col-md-4"
          >
            <div class="bg-white mb-3 mb-md-0">
              <a
                :href="`/${defaultLangCode}/product-travel/detail/${product.productId}`"
                target="_blank"
              >
                <img
                  class="d-block w-100"
                  :src="productThumbnail"
                  :alt="productName"
                />
              </a>

              <div class="px-16 py-3">
                <h2 class="heading-5 mb-3">
                  <a
                    class="deep-dark"
                    :href="`/${defaultLangCode}/product-travel/detail/${product.productId}`"
                    target="_blank"
                    >{{ productName }}</a
                  >
                </h2>

                <template v-for="attr in productAttr">
                  <div
                    v-if="attr.ofSystem == 2"
                    :key="attr.attributeId"
                    class="d-flex align-items-baseline justify-content-between mb-2"
                  >
                    <span class="text-nowrap mr-2"
                      >{{ attr.attributeName }}:</span
                    >
                    <span class="ml-16">{{ attr.values.join(', ') }}</span>
                  </div>
                </template>

                <v-divider />

                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2">Giá:</span>
                  <span class="secondary ml-16"
                    >{{
                      productPrice
                        | priceTransform(currentExchangeRate)
                        | numeralFormat
                    }}
                    {{ currentUnitCode }} / {{ $t('product.index') }}</span
                  >
                </div>

                <div
                  v-if="!$route.path.includes('/booking/product-travel/review')"
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2"
                    >{{ $t('booking.payment') }}:</span
                  >
                  <span class="secondary ml-16"
                    >{{
                      totalPrice
                        | priceTransform(currentExchangeRate)
                        | numeralFormat
                    }}
                    {{ defaultCurrency.code }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div
            class="d-flex flex-column"
            :class="
              !$route.path.includes('/booking/product-travel/result')
                ? 'col-md-8'
                : 'col-12'
            "
          >
            <nuxt-child
              :productPrice="productPrice"
              :productName="productName"
            />
          </div>
        </div>
      </div>
    </div>
  </client-only>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { DATE_TIME_FORMAT } from '~/utils/configs';
import { TOUR_DEPARTURE_TYPE } from '~/utils/constants';

export default {
  layout: 'payment',

  validate({ query }) {
    return ['id'].every((key) => key in query);
  },

  scrollToTop: true,

  async fetch() {
    try {
      const { id } = this.$route.query;
      const result = await this.getProductTravelDetail({
        product_id: id
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
    ...mapState('common/common', ['defaultCurrency', 'defaultLang']),
    ...mapGetters('productTravel/productTravel', {
      product: 'productTravelDetail'
    }),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),

    totalPrice() {
      let total_price = null;
      total_price =
        Number(this.$route.query.amount) * Number(this.productPrice);
      return total_price;
    },

    productAttr() {
      const { attributes = [] } = this.product;
      return attributes && attributes.length
        ? attributes.map((attr) => {
            const { values = [] } = attr;
            if (values && values.length) {
              const valueCurrentLang =
                values.find((item) => item.langId === this.defaultLang.id) ||
                {};
              return { ...attr, values: valueCurrentLang.value || [] };
            } else return [];
          })
        : [];
    },

    productName() {
      const attrName =
        this.productAttr.find((item) => item.attributeId === 2) || {};
      return attrName.values ? attrName.values.toString() : '';
    },

    productThumbnail() {
      const attrThumb =
        this.productAttr.find((item) => item.attributeId === 13) || {};
      return attrThumb.values && attrThumb.values[0] ? attrThumb.values[0] : '';
    },

    productPrice() {
      const attrPrice =
        this.productAttr.find((item) => item.attributeId === 11) || {};
      return attrPrice.values && attrPrice.values[0]
        ? parseFloat(attrPrice.values[0])
        : 0;
    }
  },

  created() {
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
        routePath: `/booking/product-travel/result`
      }
    ]);
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  },

  // beforeRouteLeave(to, from, next) {
  //   if (!this.$route.path.includes('/booking/product-travel/result')) {
  //     const answer = window.confirm(
  //       this.$t('booking.confirm_out')
  //     );
  //     if (answer) {
  //       next();
  //     } else {
  //       next(false);
  //     }
  //   } else {
  //     next();
  //   }
  // },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    this.setHeaderPaymentSteps([]);
  },

  methods: {
    ...mapActions('productTravel/productTravel', ['getProductTravelDetail']),
    ...mapMutations('common/headerPayment', ['setHeaderPaymentSteps']),

    handleWindowBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = '';
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/pages/_booking.scss';
</style>
