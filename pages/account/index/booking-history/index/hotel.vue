<template>
  <div>
    <BookingBox
      v-for="(item, i) in listHotel"
      :key="`${item.id}-${i}`"
      :name="item.product_name"
      :image="item.thumbnail"
      :note="
        item.phone == null
          ? $t('hotel.cancel_before_3day_with_hotline')
          : $t('hotel.cancel_before_3day') + item.phone
      "
      :price-text="`${numeralFormat(item.total_amount)} ${item.currency_code}`"
      show-price
      :to="`/${defaultLangCode}/hotel/detail/${item.product_id}`"
      :status="item.order_status"
    >
      <template slot="description">
        <p class="deep-dark">
          {{ item.product_address }}
        </p>

        <p class="d-xl-none">
          {{ $t('product.code_room') }}:
          <span class="deep-dark">{{ item.order_id_mask }}</span>
        </p>
        <p>
          {{ $t('hotel.time') }}:
          <span class="deep-dark"
            >{{ item.check_in.slice(0, 16) }} {{ $t('header.come') }}
            {{ item.check_out.slice(0, 16) }}</span
          >
        </p>
        <p>
          {{ $t('booking.infor_booking_room') }}:
          <span class="deep-dark"
            >{{ timeNight(item) === 0 ? '1' : timeNight(item) }}
            {{ $t('hotel.night') }}, {{ item.room_quantity }}
            {{ $t('header.room') }}, {{ item.people_quantity }}
            {{ $t('header.guest') }}</span
          >
        </p>
        <p>
          {{ $t('tour.time_request') }}:
          <span class="deep-dark">{{ item.create_time }}</span>
        </p>
      </template>

      <template slot="price">
        <p>
          {{ $t('booking.payment') }}:
          <v-tooltip placement="top">
            <b slot="activator" class="body-1 secondary ml-2">
              {{ item.total_amount | numeralFormat }}
              {{ item.rest_room_currency_code }}
            </b>
            <div
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('booking.price_night') }}
              <span class="ml-2 fw-semiBold"
                >{{ item.rest_room_amount | numeralFormat }}
                {{ item.rest_room_currency_code }}</span
              >
            </div>
            <div
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('booking.number_night') }}
              <span class="ml-2 fw-semiBold">
                {{ timeNight(item) === 0 ? '1' : timeNight(item) }}</span
              >
            </div>
          </v-tooltip>
        </p>
      </template>

      <template slot="content-right" slot-scope="{ status }">
        <div class="d-none d-xl-block">
          <div>{{ $t('product.code_room') }}:</div>
          <div class="deep-dark mb-2">{{ item.order_id_mask }}</div>
        </div>
        <!-- 7: Thành công -->
        <v-button
          v-if="status === ORDER_STATUS.SUCCESS"
          variant="primary"
          rounded
          >{{ $t('booking.success') }}</v-button
        >
        <!-- 1: đã hủy -->
        <v-button
          v-else-if="
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
        <!-- 5 :Đang huỷ-->
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
          {{ $t('hotel.cancel_room') }}
        </v-button>
        <v-tooltip placement="top" v-else>
          <v-button :disabled="true" slot="activator" variant="dark" rounded>
            {{ $t('hotel.cancel_room') }}
          </v-button>
          <div
            v-if="checkPopup(item)"
            class="d-flex align-items-baseline justify-content-between my-2"
          >
            {{ $t('tour.just_left') }}
            {{ timeHours(item) === 0 ? '1' : timeHours(item) }}
            {{ $t('hotel.not_cancel') }}
            {{
              item.phone == null
                ? $t('booking.hotline')
                : $t('tour.phone_number') + item.phone
            }}
            {{ $t('tour.for_assistance') }}
          </div>
          <div
            v-else
            class="d-flex align-items-baseline justify-content-between my-2"
          >
            {{ $t('hotel.exceed_time_booking_room') }}
            {{
              item.phone == null
                ? $t('booking.hotline')
                : $t('tour.phone_number') + item.phone
            }}
            {{ $t('tour.for_assistance') }}
          </div>
        </v-tooltip>
      </template>
    </BookingBox>
    <div class="container">
      <AppPagination :pageable="hotelPagination" />
    </div>
    <NotFound
      class="col-12 mb-5 animated fadeIn"
      v-if="listHotel && listHotel.length === 0 && loaded"
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
    ...mapActions('common/transaction', ['getTransactionHotel']),
    ...mapActions('common/transaction', ['postCancelTransaction']),
    numeralFormat,
    getList() {
      this.getTransactionHotel({
        lang: this.$store.state.common.common.defaultLang.id,
        currency: this.$store.state.common.common.defaultCurrency.id,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      }).then((response) => {
        if (!response.error) {
          this.listHotel = response.data.data;
          this.hotelPagination = response.data.pageable;
          this.loaded = true;
        }
      });
    },
    checkBtn(obj) {
      const timeNow = moment().format('DD/MM/YYYY');
      const day = moment
        .duration(
          moment(obj.check_in, 'DD/MM/YYYY').diff(moment(timeNow, 'DD/MM/YYYY'))
        )
        .asDays();
      if (
        (day < 3 &&
          day >= 0 &&
          obj.order_status !== 2 &&
          obj.order_status !== 3) ||
        (day > 3 && obj.order_status === 2) ||
        (day > 3 && obj.order_status === 3) ||
        (day >= 3 && obj.order_status !== 2 && obj.order_status !== 3)
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkPopup(obj) {
      const timeNow = moment().format('DD/MM/YYYY');
      const day = moment
        .duration(
          moment(obj.check_in, 'DD/MM/YYYY').diff(moment(timeNow, 'DD/MM/YYYY'))
        )
        .asDays();
      if (
        (day <= 3 && day >= 0 && obj.order_status !== 2) ||
        (day <= 3 && day >= 0 && obj.order_status === 2)
      ) {
        return true;
      } else {
        return false;
      }
    },
    timeHours(obj) {
      const timeNow = moment().format('DD/MM/YYYY');
      const day = moment
        .duration(
          moment(obj.check_in, 'DD/MM/YYYY').diff(moment(timeNow, 'DD/MM/YYYY'))
        )
        .asDays();
      if (day <= 3 && day >= 0) {
        return day;
      }
    },
    timeNight(obj) {
      const day = moment
        .duration(
          moment(obj.check_out, 'DD/MM/YYYY').diff(
            moment(obj.check_in, 'DD/MM/YYYY')
          )
        )
        .asDays();
      return day;
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
    },
    clickLink(item) {
      console.log('clickLink booking again', item);
      this.$router.push({
        path: `/${this.defaultLangCode}/booking/hotel/review`,
        query: {
          room_id: item.rest_room_id,
          hotel_id: item.product_id,
          start_date: item.check_in,
          end_date: item.check_out,
          // number_room_available: item.room_quantity,
          number_room_booked: item.room_quantity,
          number_person_booked: item.people_quantity
        }
      });
    }
  },

  data() {
    return {
      modalCancelBooking: false,
      modalBookingFailed: false,
      listHotel: [],
      checkText: {},
      loaded: false,
      hotelPagination: {}
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
