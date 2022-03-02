<template>
  <div class="buy-item">
    <div class="buy-item__price">
      <span class="heading-5 deep-dark">{{ $t('product.price') }}:</span>
      <span class="heading-4 secondary fw-bold"
        >{{ price | priceTransform(currentExchangeRate) | numeralFormat }}
        {{ currentUnitCode }}/{{ $t('product.sp') }}</span
      >
    </div>

    <div class="buy-item__input">
      <h5>{{ $t('product.number') }}</h5>
      <button class="count-item" @click="calPriceProduct">
        <span class="heading-5 mr-5">{{ number }}</span>
        <v-counter v-model="number" />
      </button>
    </div>

    <div class="buy-item__total text-right">
      <span class="heading-5 secondary"
        >{{ $t('tour.total') }}
        {{ priceProduct | priceTransform(currentExchangeRate) | numeralFormat }}
        {{ currentUnitCode }}</span
      >
      <!-- tạm ẩn disable chức năng đặt trước 20/1-->
      <v-button
        v-if="status !== PRODUCT_STATUS.OUT_OF_STOCK"
        variant="secondary"
        size="lg"
        class="buy-now ml-5"
        :disabled="status === PRODUCT_STATUS.DISABLED"
        @click="submit"
        >{{
          status === PRODUCT_STATUS.OUT_OF_STOCK
            ? $t('product.btn_out_of_stock')
            : $t('product.buy_now')
        }}</v-button
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { PRODUCT_STATUS } from '~/utils/constants';

export default {
  props: {
    price: {
      type: String
    },
    id: {},
    status: {}
  },
  data() {
    return {
      number: 1,
      priceProduct: 0
    };
  },
  computed: {
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ])
  },
  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  },

  watch: {
    price: {
      immediate: true,
      handler() {
        this.calPriceProduct();
      }
    }
  },

  methods: {
    calPriceProduct() {
      this.priceProduct = this.number * this.price;
    },

    submit() {
      this.$router.push({
        path:
          this.status === PRODUCT_STATUS.OUT_OF_STOCK
            ? `/${this.defaultLangCode}/booking/product-travel/pre-order`
            : `/${this.defaultLangCode}/booking/product-travel/review`,
        query: {
          id: this.id,
          amount: this.number
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/product-travel/_buy-item.scss';
</style>