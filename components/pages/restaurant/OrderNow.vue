<template>
  <div class="order-now" id="order-now">
    <div class="body-1 order-now__title">{{ $t('restaurant.book_now') }}</div>
    <div class="row">
      <div class="col-12 col-md-5 mb-4 mb-md-0">
        <p>{{ $t('restaurant.booking_time') }}</p>
        <div class="time-order">
          <AppDatePicker
            placeholder="DD/MM/YYYY"
            v-model="params.booking_date"
            :disabledDate="
              (tempValue) =>
                tempValue <
                new Date(new Date().setDate(new Date().getDate() - 1))
            "
          />
          <AppDatePicker
            :disabledTime="notBeforeNow"
            type="time"
            placeholder="00:00"
            :minuteStep="1"
            :hourOptions="hourOptions"
            :minuteOptions="minuteOptions"
            v-model="params.booking_hour"
          />
        </div>
      </div>

      <div class="col-12 col-md-7">
        <p>{{ $t('restaurant.number') }}</p>
        <div class="people-come">
          <button class="count-people">
            <span class="mr-5">{{ adults }} {{ $t('header.adults') }}</span>
            <v-counter v-model="adults" :showValue="false" />
          </button>

          <button class="count-people">
            <span class="mr-5"
              >{{ children }} {{ $t('restaurant.children') }}</span
            >
            <v-counter v-model="children" :showValue="false" />
          </button>

          <v-button
            class="btn-order-confirm"
            variant="primary"
            size="md"
            @click="submit()"
            :disabled="disabled || !checkSumit"
            >{{ $t('restaurant.confirm') }}</v-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DATE_TIME_FORMAT } from '~/utils/configs';
import moment from 'moment';
import AppDatePicker from '~/components/app/AppDatePicker';
import { mapActions, mapGetters, mapState } from 'vuex';
import { get } from 'lodash';

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
      adults: 1,
      children: 0,
      params: {
        channel: 'SDL_BKAV_APP',
        payment_type: 1,
        order_type: 1,
        product_type: 1,
        product_id: null,
        customer_name: '',
        customer_phone: '',
        nation_id: 1,
        customer_email: '',
        note: '',
        booking_date: this.$moment(
          new Date(new Date().setDate(new Date().getDate() + 1))
        ).format('DD/MM/YYYY HH:mm:ss'),
        booking_hour: this.$moment(
          new Date(new Date().setDate(new Date().getDate() + 1))
        ).format('DD/MM/YYYY HH:mm:ss'),
        person_quantity: 1
      },
    }
  },

  watch: {
    'params.booking_date': function (value) {
      if (!value) return
      // check is current day
      const currentDate = this.$moment(
        new Date(new Date().setDate(new Date().getDate()))
      ).format('YYYY-MM-DD HH:mm:ss')

      const selectedDate = this.$moment(value, DATE_TIME_FORMAT).format('YYYY-MM-DD')
      const selectedTime = this.$moment(this.params.booking_hour, DATE_TIME_FORMAT).format('HH:mm:ss')

      const isAfter = this.$moment(`${selectedDate} ${selectedTime}`).isAfter(currentDate)
      if (isAfter) return

      this.params.booking_hour = this.$moment(
        new Date(new Date().setDate(new Date().getDate() + 1))
      ).format(DATE_TIME_FORMAT)
    } 
  },

  computed: {
    ...mapGetters('restaurant/restaurant', ['restaurantDetail']),
    ...mapGetters('common/common', ['defaultLangCode']),

    checkSumit() {
      const qty = this.adults + this.children;
      const check = this.params.booking_date && qty;
      return check;
    },

    getTimeOption() {
      let option = {
        hours: {
          start: 0,
          end: 23
        },
        minutes: {
          start: 0,
          end: 59
        }
      };
      let openTimes = get(this.restaurantDetail, 'box_data.open_time', {});
      let day = new Date(
        this.$moment(this.params.booking_date, 'DD/MM/YYYY HH:mm:ss')
      ).getDay();
      switch (day) {
        case 1:
          day = 'mo';
          break;
        case 2:
          day = 'tu';
          break;
        case 3:
          day = 'we';
          break;
        case 4:
          day = 'th';
          break;
        case 5:
          day = 'fr';
          break;
        case 6:
          day = 'sa';
          break;
        case 7:
          day = 'su';
          break;
        default:
          day = 'mo';
          break;
      }

      option.hours.start = openTimes[day] ? openTimes[day].substring(0, 2) : 0;
      option.hours.end = openTimes[day] ? openTimes[day].substring(6, 8) : 23;
      option.minutes.start = openTimes[day]
        ? openTimes[day].substring(3, 5)
        : 0;
      option.minutes.end = openTimes[day]
        ? openTimes[day].substring(9, 11)
        : 59;

      return option;
    },

    hourOptions() {
      let options = [];
      let start = parseInt(get(this, 'getTimeOption.hours.start', 0));
      let end = parseInt(get(this, 'getTimeOption.hours.end', 23));
      for (let i = start; i <= end; i++) {
        options.push(i);
      }
      return options;
    },

    minuteOptions() {
      let options = [];
      let hour = new Date(
        this.$moment(this.params.booking_hour, 'DD/MM/YYYY HH:mm:ss')
      ).getHours();
      let start = 0;
      let end = 59;
      if (hour == get(this, 'getTimeOption.hours.start', '')) {
        start = parseInt(get(this, 'getTimeOption.minutes.start', 0));
      }
      if (hour == get(this, 'getTimeOption.hours.end', '')) {
        end = parseInt(get(this, 'getTimeOption.minutes.end', 59));
      }
      for (let i = start; i <= end; i++) {
        options.push(i);
      }

      return options;
    },

    checkTime() {
      let start = parseInt(
        get(this, 'getTimeOption.hours.start', 0) +
          get(this, 'getTimeOption.minutes.start', 0)
      );
      let end = parseInt(
        get(this, 'getTimeOption.hours.end', 0) +
          get(this, 'getTimeOption.minutes.end', 0)
      );
      let hour = parseInt(
        this.$moment(
          new Date(
            this.$moment(this.params.booking_hour, 'DD/MM/YYYY HH:mm:ss')
          )
        )
          .format('HH:mm')
          .replace(':', '')
      );

      return hour >= start && hour <= end;
    }
  },

  methods: {
    get,

    submit() {
      if (this.checkSumit && this.checkTime) {
        this.$router.push({
          path: `/${this.defaultLangCode}/booking/restaurant/review`,
          query: {
            id: get(this.$route, 'params.id', ''),
            person_quantity: this.adults + this.children,
            booking_hour: this.params.booking_hour,
            booking_date: this.params.booking_date
          }
        });
      } else if (!this.params.booking_date) {
        this.$toast.error(this.$t('restaurant.select_reservation_date'));
      } else if (!this.params.booking_hour) {
        this.$toast.error(this.$t('restaurant.selecet_reservation_time'));
      } else if (!this.children && !this.adults) {
        this.$toast.error(this.$t('restaurant.select_number_people'));
      } else if (!this.checkTime) {
        this.$toast.error(this.$t('restaurant.selecet_time_open'));
      }
    },
    notBeforeNow(event) {
      const TableReservationTime = moment(
        this.params.booking_date,
        'DD/MM/YYYY'
      ).format('YYYY-MM-DD');
      const NewDate = moment().format('YYYY-MM-DD');
      if (NewDate === TableReservationTime) {
        if (event.getHours() < new Date().getHours()) {
          return true;
        } else if (
          event.getHours() === new Date().getHours() &&
          event.getMinutes() < new Date().getMinutes()
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/restaurant/_order-now.scss';
</style>
