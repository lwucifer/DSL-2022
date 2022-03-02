<template>
  <div>
    <BookingBox
      v-for="(item, i) in listProducts"
      :key="`${item.id}-${i}`"
      :name="item.productName"
      :image="item.productThumbnail"
      :price-text="`${numeralFormat(item.total_amount)}`"
      show-price
      :to="`/${defaultLangCode}/product-travel/detail/${item.productId}`"
      :status="item.orderStatus"
    >
      <template slot="description">
        <p class="d-xl-none">
          {{ $t('product.tourism_code') }}:
          <span class="deep-dark">{{ item.orderIdMask }}</span>
        </p>
        <p>
          {{ $t('product.transaction_time') }}:
          <span class="deep-dark">{{
            item.createTime && item.createTime.slice(0, 16)
          }}</span>
        </p>
        <p>
          {{ $t('product.number') }}:
          <span class="deep-dark"> {{ item.quantity }}</span>
        </p>
        <p>
          {{ $t('product.price_product') }}:
          <b slot="activator" class="body-1 secondary ml-2">
            {{ item.productAmount | numeralFormat }} {{ item.currencyCode }}
          </b>
        </p>
      </template>
      <template slot="price">
        <p>
          {{ $t('booking.payment') }}:
          <b slot="activator" class="body-1 secondary ml-2">
            {{ item.totalAmount | numeralFormat }} {{ item.currencyCode }}
          </b>
        </p>
      </template>
      <template slot="content-right" slot-scope="{ status }">
        <div class="d-none d-xl-block">
          <div>{{ $t('product.tourism_code') }}:</div>
          <div class="deep-dark mb-2">{{ item.orderIdMask }}</div>
        </div>
        <div>
          <v-button
            v-if="
              status === ORDER_STATUS.CANCELED ||
              status === ORDER_STATUS.REJECT ||
              status === ORDER_STATUS.CLOSED ||
              status === ORDER_STATUS.SUCCESS
            "
            variant="primary"
            rounded
            @click="clickLink(item)"
            >{{ $t('tour.booking_again') }}</v-button
          >
          <v-button
            v-else-if="status === ORDER_STATUS.CANCELING"
            variant="primary"
            rounded
            @click="refund(item)"
            >{{ $t('tour.refuned') }}</v-button
          >
          <v-button
            v-else-if="checkBtn(item)"
            @click="openPopUp(item)"
            variant="danger"
            rounded
          >
            {{ $t('product.cancel_transaction') }}
          </v-button>
        </div>
      </template>
    </BookingBox>
    <div class="container">
      <AppPagination :pageable="productsPagination" />
    </div>
    <NotFound
      class="col-12 mb-5 animated fadeIn"
      v-if="listProducts && listProducts.length === 0 && loaded"
    />
    <ModalCancelBooking
      :dataCheck="checkText"
      v-model="modalCancelBooking"
      @cancel="modalCancelBooking = false"
      @confirm="cancelcheck($event)"
    />
    <ModalBookingFailed
      v-model="modalBookingFailed"
      @cancel="modalBookingFailed = false"
      @ok="modalBookingFailed == false"
    />
  </div>
</template>

<script>
import { ORDER_STATUS, PAGER } from '~/utils/constants';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import BookingBox from '~/components/pages/account/booking-history/BookingBox.vue';
import ModalCancelBooking from '~/components/pages/account/booking-history/ModalCancelBooking.vue';
import ModalBookingFailed from '~/components/pages/account/booking-history/ModalBookingFailed.vue';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { numeralFormat } from '~/plugins/filters';
import NotFound from '~/components/pages/common/NotFound';

export default {
  components: {
    BookingBox,
    ModalCancelBooking,
    ModalBookingFailed,
    NotFound
  },
  created() {
    this.getList();
    this.ORDER_STATUS = Object.freeze(ORDER_STATUS);
  },
  computed: {
    ...mapGetters('common/common', ['defaultLangCode'])
  },

  methods: {
    ...mapActions('common/transaction', ['getTransactionProducts']),
    ...mapActions('common/transaction', ['postCancelTransaction']),
    numeralFormat,
    getList() {
      this.getTransactionProducts({
        lang: this.$store.state.common.common.defaultLang.id,
        currency: this.$store.state.common.common.defaultCurrency.id,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      }).then((response) => {
        if (!response.error) {
          this.listProducts = response.data.data;
          this.productsPagination = response.data.pageable;
          this.loaded = true;
        }
      });
    },
    checkBtn(obj) {
      if (
        obj.order_status !== 0 ||
        obj.order_status !== 2 ||
        obj.order_status !== 4 ||
        obj.order_status !== 5 ||
        obj.order_status !== 3
      ) {
        return true;
      } else {
        return false;
      }
    },
    openPopUp(value) {
      this.modalCancelBooking = true;
      this.checkText = value;
    },
    async refund(value) {
      this.modalCancelBooking = false;
      const result = await this.postCancelTransaction({
        transId: value.transId,
        status: 2,
        note: ''
      });
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('account.send_request_success'));
        this.getList();
      } else {
        this.$toasted.error(this.$t('account.send_request_failed'));
      }
    },
    async cancelcheck(event) {
      this.modalCancelBooking = false;
      const result = await this.postCancelTransaction({
        transId: this.checkText.transId,
        status: 1,
        note: event
      });
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('account.send_request_success'));
        this.getList();
      } else {
        this.$toasted.error(this.$t('account.send_request_failed'));
      }
    },
    clickLink(item) {
      this.$router.push({
        path: `/${this.defaultLangCode}/booking/product-travel/review`,
        query: {
          id: item.productId,
          numer_product: 0,
          amount: item.quantity,
          // customer_name,
          // customer_phone,
          // customer_email,
          ward: item.wardId,
          district: item.districtId,
          // city,
          address: item.address,
          // note,
          // get_at_store,
          total_price: item.totalAmount
          // district_code,
          // city_code
        }
      });
    }
  },

  data() {
    return {
      modalCancelBooking: false,
      modalBookingFailed: false,
      listProducts: [],
      checkText: {},
      loaded: false,
      productsPagination: {}
    };
  },

  fetch() {
    this.getList();
    this.ORDER_STATUS = Object.freeze(ORDER_STATUS);
  },

  watch: {
    '$route.query': function (newValue) {
      this.getList();
      this.$scrollTo('#container-common-search-form');
    }
  }
};
</script>

<style></style>
