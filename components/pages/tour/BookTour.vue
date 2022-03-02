<template>
  <section class="book-tour">
    <div class="row book-tour__row">
      <div class="col-md-4 book-tour__col">
        <label class="book-tour__label body-1 deep-dark mt-0">{{$t("tour.date_start")}}</label>
        <v-select
          v-if="tour.departure_type === TOUR_DEPARTURE_TYPE.PLAN"
          v-model="startDate"
          :options="scheduleOpts"
          class="w-100"
          :placeholder="$t('tour.choose_date_start')"
          size="lg"
        >
        </v-select>
        <AppDatePicker
          v-else
          v-model="startDate"
          class="w-100"
          :placeholder="DATE_DISPLAY_FORMAT"
          :disabled-date="setDisabledDate"
          size="lg"
        />
      </div>

      <div class="col-md-4 book-tour__col">
        <label class="book-tour__label body-1 deep-dark">{{$t("header.adults")}}</label>
        <div class="book-tour__counter">
          <span class="mr-5"
            >{{
              totalAdultsPrice
                | priceTransform(currentExchangeRate)
                | numeralFormat
            }}
            {{ currentUnitCode }}</span
          >
          <v-counter v-model="adults" />
        </div>
      </div>

      <div class="col-md-4 book-tour__col">
        <label class="book-tour__label body-1 deep-dark">{{$t("restaurant.children")}}</label>
        <div class="book-tour__counter">
          <span class="mr-5"
            >{{
              totalChildrenPrice
                | priceTransform(currentExchangeRate)
                | numeralFormat
            }}
            {{ currentUnitCode }}</span
          >
          <v-counter v-model="children" />
        </div>
      </div>

      <!-- <div class="col-md-3 book-tour__col">
        <label class="book-tour__label body-1 deep-dark">Mã khuyến mại</label>
        <v-input
          v-model="promotionCode"
          type="text"
          placeholder="Nhập mã"
          class="w-100"
          size="lg"
          @input="handleInputPromotionCode"
        />
      </div> -->
    </div>

    <div class="text-right mt-16">
      <b v-show="totalPrice" class="primary mr-5"
        >{{$t("tour.total")}}
        {{ totalPrice | priceTransform(currentExchangeRate) | numeralFormat }}
        {{ currentUnitCode }}
      </b>
      <v-button
        class="book-tour__submit"
        variant="primary"
        size="lg"
        @click="submit"
        :disabled="disabled"
        >{{$t("restaurant.confirm")}}</v-button
      >
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import { DATE_DISPLAY_FORMAT, DATE_TIME_FORMAT } from '~/utils/configs';
import { TOUR_DEPARTURE_TYPE } from '~/utils/constants';
import AppDatePicker from '~/components/app/AppDatePicker';

export default {
  components: {
    AppDatePicker
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      adults: 0,
      children: 0,
      startDate: null,
      totalPrice: 0
    };
  },

  computed: {
    ...mapState('tour/tour', {
      tour: 'tourDetail'
    }),
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode']),

    scheduleOpts() {
      const { departure_schedule: departureSchedule = [] } = this.tour;
      if (departureSchedule && departureSchedule.length) {
        return departureSchedule.reduce((schedule, item) => {
          const startMoment = this.$moment(item.start_time, DATE_TIME_FORMAT);
          if (startMoment.toDate().getTime() < new Date().getTime()) return schedule;
          
          const start = startMoment.format(
            'dd - DD/MM/YYYY'
          );
          const end = this.$moment(item.return_time, DATE_TIME_FORMAT).format(
            'dd - DD/MM/YYYY'
          );

          schedule.push({
            value: item.start_time,
            text: start + ' -> ' + end
          });
          
          return schedule;
        }, []);
      } else return [];
    },

    selectedSchedule() {
      if (!this.tour.departure_schedule || !this.startDate) return {};
      const startDate = this.$moment(this.startDate, DATE_TIME_FORMAT)
        .toDate()
        .setHours(0, 0, 0, 0);
      return this.tour.departure_schedule.find((item) => {
        const startTimeParsed = this.$moment(item.start_time, DATE_TIME_FORMAT)
          .toDate()
          .setHours(0, 0, 0, 0);
        return startDate === startTimeParsed;
      });
    },

    totalAdultsPrice() {
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.DAILY)
        return this.adults * this.tour.tour_departure_schedule_daily.adult_price;
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.WEEKLY)
        return this.adults * this.tour.tour_departure_schedule_weekly.adult_price;
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.PLAN)
        return this.adults * (this.selectedSchedule.adult_price || 0);
    },

    totalChildrenPrice() {
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.DAILY)
        return this.children * this.tour.tour_departure_schedule_daily.child_price;
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.WEEKLY)
        return this.children * this.tour.tour_departure_schedule_weekly.child_price;
      if (this.tour.departure_type == TOUR_DEPARTURE_TYPE.PLAN)
        return this.children * (this.selectedSchedule.chil_price || 0);
    }
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.TOUR_DEPARTURE_TYPE = Object.freeze(TOUR_DEPARTURE_TYPE);
  },

  watch: {
    totalAdultsPrice(newValue) {
      this.totalPrice = newValue + this.totalChildrenPrice;
    },

    totalChildrenPrice(newValue) {
      this.totalPrice = newValue + this.totalAdultsPrice;
    }
  },

  methods: {
    setDisabledDate(date) {
      const {
        departure_type: type,
        tour_departure_schedule_weekly: scheduleWeekly = {}
      } = this.tour;
      const today = new Date().setHours(0, 0, 0, 0);
      const disabledDateBefore = date < today;

      if (type === TOUR_DEPARTURE_TYPE.DAILY) return disabledDateBefore;

      if (type === TOUR_DEPARTURE_TYPE.WEEKLY) {
        const DAY_KEYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        const dayOfDate = date.getDay();
        const daysAvailable = DAY_KEYS.reduce(
          (acc, key, index) => (scheduleWeekly[key] ? [...acc, index] : acc),
          []
        );
        return disabledDateBefore || daysAvailable.indexOf(dayOfDate) === -1;
      }
    },

    submit() {
      if (this.startDate && (this.children || this.adults)) {
        this.$router.push(this.localePath({
          path: '/booking/tour/review',
          query: {
            id: this.tour.tour_id,
            children: this.children,
            adults: this.adults,
            start_date: this.startDate
          }
        }));
      } else if (!this.startDate) {
        this.$toast.error(this.$t('tour.pls_choose_date_start'));
      } else if (!this.children || !this.adults) {
        this.$toast.error(this.$t('restaurant.select_number_people'));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/tour/_book-tour.scss';
</style>