<template>
  <div>
    <BookingBox
      v-for="(item, i) in listTour"
      :key="`${item.id}-${i}`"
      :name="item.product_name"
      :image="item.thumbnail"
      :note="
        item.phone == null
          ? $t('tour.cancel_2h_before')
          : $t('tour.cancel_24h_before') + item.phone
      "
      show-price
      :to="`/${defaultLangCode}/tour/detail/${item.product_id}`"
      :status="item.order_status"
    >
      <template slot="description">
        <p class="d-xl-none">
          {{ $t('booking.code_booking_tour') }}
          <span class="deep-dark">{{ item.order_id_mask }}</span>
        </p>
        <p>
          <!-- {{ item }} -->
          {{ $t('tour.date_start') }}:
          <span class="deep-dark">{{ item.departure_day }} </span>
        </p>
        <p>
          {{ $t('tour.schedule') }}:
          <span class="deep-dark"
            >{{ item.number_day }} {{ $t('hotel.day') }}
            {{ item.number_night }} {{ $t('hotel.night') }}</span
          >
        </p>
        <p>
          {{ $t('tour.from') }}:
          <span class="deep-dark">{{ item.departure_place }}</span>
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
              {{ item.total_amount | numeralFormat }} {{ item.currency_code }}
            </b>
            <div
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('header.adults') }}:
              <span class="ml-2 fw-semiBold"
                >{{ item.adults_price | numeralFormat }}
                {{ item.currency_code }}</span
              >
            </div>
            <div
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('restaurant.children') }}:
              <span class="ml-2 fw-semiBold"
                >{{ item.child_price | numeralFormat }}
                {{ item.currency_code }}</span
              >
            </div>
          </v-tooltip>
        </p>
      </template>

      <template slot="content-right" slot-scope="{ status }">
        <div class="d-none d-xl-block">
          <div>{{ $t('booking.code_booking_tour') }}</div>
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
            {{ $t('tour.cancel_request') }}
          </v-button>
          <v-tooltip placement="bottom" v-else>
            <v-button :disabled="true" slot="activator" variant="dark" rounded>
              {{ $t('tour.cancel_request') }}
            </v-button>

            <div
              v-if="checkPopup(item)"
              class="d-flex align-items-baseline justify-content-between my-2"
            >
              {{ $t('tour.just_left') }}
              {{ timeHours(item) === 0 ? '1' : timeHours(item) }}
              {{ $t('tour.not_cancel') }}
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
      <AppPagination :pageable="tourPagination" />
    </div>
    <NotFound
      class="col-12 mb-5 animated fadeIn"
      v-if="listTour && listTour.length === 0 && loaded"
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
import BookingBox from '~/components/pages/account/booking-history/BookingBox.vue';
import { ORDER_STATUS, PAGER } from '~/utils/constants';
import moment from 'moment';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import ModalCancelBooking from '~/components/pages/account/booking-history/ModalCancelBooking.vue';
import ModalBookingFailed from '~/components/pages/account/booking-history/ModalBookingFailed.vue';
import { numeralFormat } from '~/plugins/filters';
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
      listTour: [],
      checkText: {},
      loaded: false,
      tourPagination: {}
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
    this.getList();
    this.ORDER_STATUS = Object.freeze(ORDER_STATUS);
  },
  methods: {
    ...mapActions('common/transaction', ['getTransactionTour']),
    ...mapActions('common/transaction', ['postCancelTransaction']),
    numeralFormat,

    getList() {
      this.getTransactionTour({
        lang: this.$store.state.common.common.defaultLang.id,
        currency: this.$store.state.common.common.defaultCurrency.id,
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        ...this.$route.query
      }).then((response) => {
        if (!response.error) {
          this.listTour = response.data.data;
          this.tourPagination = response.data.pageable;
          this.loaded = true;
        }
      });
    },
    checkBtn(obj) {
      const timeNow = moment().format('DD/MM/YYYY');
      const day = moment
        .duration(
          moment(obj.departure_day, 'DD/MM/YYYY').diff(
            moment(timeNow, 'DD/MM/YYYY')
          )
        )
        .asDays();
      if (
        (day < 1 && day > 0 && obj.order_status === 2) ||
        (day < 1 && day > 0 && obj.order_status === 3) ||
        (day > 0 &&
          obj.order_status !== 2 &&
          day > 0 &&
          obj.order_status !== 3) ||
        (day > 1 && obj.order_status === 2) ||
        (day > 1 && obj.order_status === 3)
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
          moment(obj.departure_day, 'DD/MM/YYYY').diff(
            moment(timeNow, 'DD/MM/YYYY')
          )
        )
        .asDays();
      if (
        (day <= 1 && day >= 0 && obj.order_status === 2) ||
        (day <= 1 && day >= 0 && obj.order_status !== 2)
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
          moment(obj.departure_day, 'DD/MM/YYYY').diff(
            moment(timeNow, 'DD/MM/YYYY')
          )
        )
        .asDays();
      if (day <= 1 && day >= 0) {
        return day;
      }
    },
    clickLink(item) {
      this.$router.push(
        this.localePath({
          path: `/booking/tour`,
          query: {
            id: item.product_id,
            schedule_id: null,
            adults: item.adults_quantity,
            children: item.child_quantity,
            start_date: item.departure_day + ' 00:00:00'
          }
        })
      );
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
  watch: {
    '$route.query': function (newValue) {
      this.getList();
      this.$scrollTo('#container-common-search-form');
    }
  }
};
</script>

<style></style>
