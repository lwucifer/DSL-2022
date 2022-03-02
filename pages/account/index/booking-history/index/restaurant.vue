<template>
  <div>
    <BookingBox
      v-for="(item, i) in listRestaurant"
      :key="`${item.id}-${i}`"
      :name="item.product_name"
      :image="item.thumbnail"
      :note="
        item.phone == null
          ? $t('tour.cancel_2h_before')
          : $t('tour.cancel_24h_before') + item.phone
      "
      :to="`/${defaultLangCode}/restaurant/detail/${item.product_id}`"
      :status="item.order_status"
    >
      <template slot="description">
        <p class="deep-dark">
          <!-- {{ item }} -->
          {{ item.product_address }}
        </p>
        <p class="d-xl-none">
          {{ $t('booking.code_booking_table') }}
          <span class="deep-dark">{{ item.order_id_mask }}</span>
        </p>
        <p>
          {{ $t('restaurant.booking_time') }}:
          <span class="deep-dark"> {{ item.booking_date }}</span>
        </p>
        <p>
          {{ $t('product.number') }}:
          <span class="deep-dark"
            >{{ item.cust_quantity }} {{ $t('hotel.people') }}</span
          >
        </p>
        <p>
          {{ $t('tour.time_request') }}:
          <span class="deep-dark">{{ item.create_time }}</span>
        </p>
      </template>

      <template slot="content-right" slot-scope="{ status }">
        <div class="d-none d-xl-block">
          <div>{{ $t('booking.code_booking_table') }}</div>
          <div class="deep-dark mb-2">{{ item.order_id_mask }}</div>
        </div>
        <div>
          <v-button
            v-if="status === ORDER_STATUS.SUCCESS"
            variant="primary"
            rounded
            >{{ $t('booking.success') }}</v-button
          >
          <v-button
            v-else-if="
              status === ORDER_STATUS.CANCELED || status === ORDER_STATUS.REJECT
            "
            variant="primary"
            rounded
            @click="clickLink(item)"
            >{{ $t('tour.booking_again') }}</v-button
          >
          <!-- 5 :Đang huỷ-->
          <v-button
            v-else-if="status === ORDER_STATUS.CANCELING"
            variant="primary"
            rounded
            @click="refund(item)"
            >{{ $t('tour.refuned') }}</v-button
          >
          <!--  || status === ORDER_STATUS.PENDING -->
          <v-button
            v-else-if="checkBtn(item)"
            @click="openPopUp(item)"
            variant="danger"
            rounded
          >
            {{ $t('restaurant.cancel_booking_table') }}
          </v-button>
          <v-tooltip placement="top" v-else>
            <v-button :disabled="true" slot="activator" variant="dark" rounded>
              {{ $t('restaurant.cancel_booking_table') }}
            </v-button>

            <div
              v-if="checkPopup(item)"
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              <!-- timeMinutes -->
              {{ $t('tour.just_left') }}
              {{ timeHours(item) === 0 ? '' : timeHours(item) + 'giờ' }}
              {{ timeMinutes(item) }} {{ $t('restaurant.not_cancel_in_2h') }}

              {{
                item.phone == null ? 'hotline' : 'số điện thoại: ' + item.phone
              }}
              {{ $t('tour.for_assistance') }}
            </div>
            <div
              v-else
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('tour.exceeded_request_time') }}
              {{
                item.phone == null
                  ? $t('booking.hotline')
                  : $t('tour.phone_number') + item.phone
              }}
              {{ $t('tour.for_assistance') }}
            </div>
          </v-tooltip>
        </div>
      </template>
    </BookingBox>
    <div class="container">
      <AppPagination :pageable="restaurantPagination" />
    </div>
    <NotFound
      class="col-12 mb-5 animated fadeIn"
      v-if="listRestaurant && listRestaurant.length === 0 && loaded"
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
import { mapActions, mapGetters } from 'vuex';
import BookingBox from '~/components/pages/account/booking-history/BookingBox';
import { ORDER_STATUS, PAGER } from '~/utils/constants';
import moment from 'moment';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { numeralFormat } from '~/plugins/filters';
import ModalCancelBooking from '~/components/pages/account/booking-history/ModalCancelBooking.vue';
import ModalBookingFailed from '~/components/pages/account/booking-history/ModalBookingFailed.vue';
import NotFound from '~/components/pages/common/NotFound';

export default {
  components: {
    BookingBox,
    ModalCancelBooking,
    ModalBookingFailed,
    NotFound
  },
  data() {
    return {
      modalCancelBooking: false,
      modalBookingFailed: false,
      listRestaurant: [],
      checkText: {},
      loaded: false,
      booking_hour: this.$moment(
        new Date(new Date().setDate(new Date().getDate() + 1))
      ).format('DD/MM/YYYY HH:mm:ss'),
      restaurantPagination: {}
    };
  },
  computed: {
    ...mapGetters('common/common', ['defaultLangCode'])
  },
  methods: {
    ...mapActions('common/transaction', ['getTransactionRestaurant']),
    ...mapActions('common/transaction', ['postCancelTransaction']),

    getList() {
      this.getTransactionRestaurant({
        lang: this.$store.state.common.common.defaultLang.id,
        currency: this.$store.state.common.common.defaultCurrency.id,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      }).then((response) => {
        if (!response.error) {
          this.listRestaurant = response.data.data;
          this.restaurantPagination = response.data.pageable;
          this.loaded = true;
        }
      });
    },
    checkBtn(obj) {
      const timeNow = moment().format('DD/MM/YYYY HH:mm');
      const day = moment
        .duration(
          moment(obj.booking_date, 'DD/MM/YYYY HH:mm').diff(
            moment(timeNow, 'DD/MM/YYYY HH:mm')
          )
        )
        .asMinutes();
      if (
        (day < 120 &&
          day >= 0 &&
          obj.order_status !== 2 &&
          obj.order_status !== 3) ||
        (day > 120 && obj.order_status === 2) ||
        (day > 120 && obj.order_status === 3) ||
        (day > 120 && obj.order_status !== 2 && obj.order_status !== 3)
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkPopup(obj) {
      const timeNow = moment().format('DD/MM/YYYY HH:mm');
      const day = moment
        .duration(
          moment(obj.booking_date, 'DD/MM/YYYY HH:mm').diff(
            moment(timeNow, 'DD/MM/YYYY HH:mm')
          )
        )
        .asMinutes();
      const hours = day / 60;
      const rhours = Math.floor(hours);
      if (
        (day < 120 && day > 0 && obj.order_status !== 2) ||
        (day < 120 && day > 0 && obj.order_status === 2)
      ) {
        return true;
      } else {
        return false;
      }
    },
    timeHours(obj) {
      const timeNow = moment().format('DD/MM/YYYY HH:mm');
      const day = moment
        .duration(
          moment(obj.booking_date, 'DD/MM/YYYY HH:mm').diff(
            moment(timeNow, 'DD/MM/YYYY HH:mm')
          )
        )
        .asMinutes();
      const hours = day / 60;
      const rhours = Math.floor(hours);
      if (day <= 120 && day >= 0) {
        return rhours;
      }
    },

    timeMinutes(obj) {
      const timeNow = moment().format('DD/MM/YYYY HH:mm');
      const day = moment
        .duration(
          moment(obj.booking_date, 'DD/MM/YYYY HH:mm').diff(
            moment(timeNow, 'DD/MM/YYYY HH:mm')
          )
        )
        .asMinutes();
      const hours = day / 60;
      const rhours = Math.floor(hours);
      const minutes = day - rhours * 60;
      if (day <= 120 && day >= 0) {
        return minutes;
      }
    },
    clickLink(item) {
      // this.$router.push(`/booking/restaurant/review/${item.product_id}`);
      this.$router.push({
        path: `/${this.defaultLangCode}/booking/restaurant/review`,
        query: {
          id: item.product_id,
          booking_date: item.booking_date + ':00',
          person_quantity: item.cust_quantity,
          booking_hour: item.booking_date + ':00'
        }
      });
    },
    openPopUp(value) {
      this.modalCancelBooking = true;
      this.checkText = value;
    },
    async refund(value) {
      this.modalCancelBooking = false;
      const result = await this.postCancelTransaction({
        transId: value.trans_id,
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
        transId: this.checkText.trans_id,
        status: 1,
        note: event
      });
      if (result.code == RES_STATUS_SUCCESS) {
        this.$toasted.info(this.$t('account.send_request_success'));
        this.getList();
      } else {
        this.$toasted.error(this.$t('account.send_request_failed'));
      }
    }
  },

  created() {
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
