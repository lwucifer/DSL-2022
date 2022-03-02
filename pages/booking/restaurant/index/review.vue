<template>
  <div class="booking-review">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{ $t('booking.infor_booking_table') }}</h5>

      <div class="mb-16">
        <label for="datepicker" class="body-1 deep-dark mb-2"
          >{{ $t('booking.date_booking_table') }}
          <span class="danger">*</span></label
        >
        <AppDatePicker
          v-model="$v.bookingDate.$model"
          class="w-100"
          size="lg"
          :disabledDate="
            (tempValue) =>
              tempValue < new Date(new Date().setDate(new Date().getDate() - 1))
          "
          :placeholder="DATE_DISPLAY_FORMAT"
          :valid="$v.bookingDate.$error ? false : null"
        />
      </div>

      <div class="mb-16">
        <label for="datepicker" class="body-1 deep-dark mb-2"
          >{{ $t('restaurant.booking_time') }}
          <span class="danger">*</span></label
        >
        <AppDatePicker
          v-model="$v.bookingHour.$model"
          class="w-100"
          size="lg"
          type="time"
          placeholder="00:00"
          :minuteStep="1"
          :hourOptions="hourOptions"
          :minuteOptions="minuteOptions"
          :disabledTime="notBeforeNow"
          :valid="$v.bookingHour.$error ? false : null"
        />
      </div>

      <div class="row mb-16">
        <div class="col-md-6">
          <label class="body-1 deep-dark mb-2"
            >{{ $t('booking.number_guest') }}
            <span class="danger">*</span></label
          >
          <InputWithCounter
            v-model="$v.personQuantity.$model"
            type="number"
            :placeholder="$t('booking.input_number')"
            size="lg"
            :valid="$v.personQuantity.$error ? false : null"
          />
        </div>
      </div>

      <!-- <v-divider variant="secondary" class="my-24" /> -->
    </div>

    <div class="bg-white pa-16">
      <h5 class="mb-16">{{ $t('booking.infor_contact') }}</h5>

      <div class="mb-16">
        <p class="body-1 deep-dark mb-2">
          {{ $t('booking.contact_name') }} <span class="danger">*</span>
        </p>
        <v-input
          v-model="$v.name.$model"
          size="lg"
          :placeholder="$t('booking.input_name_passport')"
          :valid="$v.name.$error ? false : null"
        />
        <span
          v-if="$v.name.$error && !$v.name.required"
          class="danger caption"
          >{{ $t('booking.obligatory') }}</span
        >
        <span
          v-if="$v.name.$error && !$v.name.maxLength"
          class="danger caption"
          >{{ $t('booking.exceed_character') }}</span
        >
      </div>

      <div class="row mb-16">
        <div class="col-md-6">
          <p class="body-1 deep-dark mb-2">
            {{ $t('hotel.phone_number') }} <span class="danger">*</span>
          </p>
          <v-input
            v-model.trim="$v.phone.$model"
            size="lg"
            :placeholder="$t('booking.input_phone_number')"
            :valid="$v.phone.$error ? false : null"
          />
          <span
            v-if="$v.phone.$error && !$v.phone.required"
            class="danger caption"
            >{{ $t('booking.obligatory') }}</span
          >
          <span
            v-if="
              $v.phone.$error &&
              (!$v.phone.maxLength || !$v.phone.minLength || !$v.phone.numeric)
            "
            class="danger caption"
            >{{ $t('booking.right_phone_number') }}</span
          >
        </div>

        <div class="col-md-6">
          <p class="body-1 deep-dark mb-2">{{ $t('booking.nationality') }}</p>
          <v-select
            v-model="nation"
            class="w-100"
            size="lg"
            :placeholder="$t('booking.choose_nationality')"
            searchable
            :options="
              nations.map((item) => ({ value: item.id, text: item.name }))
            "
          />
        </div>
      </div>

      <div class="mb-16">
        <p class="body-1 deep-dark mb-2">Email <span class="danger">*</span></p>
        <v-input
          v-model.trim="$v.email.$model"
          size="lg"
          :placeholder="$t('booking.input_email')"
          :valid="$v.email.$error ? false : null"
          @input="$v.email.$model = $event.toLowerCase()"
          @blur="$_onValidateEmailExisted($v.email.$model)"
        />
        <span
          v-if="$v.email.$error && !$v.email.required"
          class="danger caption"
          >{{ $t('booking.obligatory') }}</span
        >
        <span
          v-if="$v.email.$error && !$v.email.email"
          class="danger caption"
          >{{ $t('booking.right_email') }}</span
        >
      </div>

      <div class="mb-16">
        <p class="body-1 deep-dark mb-2">{{ $t('booking.note') }}</p>
        <v-textarea
          v-model="note"
          size="lg"
          :placeholder="$t('booking.more_require_table')"
          rows="1"
        />
      </div>

      <div class="booking-actions mt-24 d-flex justify-content-end">
        <v-button variant="primary" size="lg" @click="next">{{$t("header.next")}}</v-button>
      </div>
    </div>
    <ModalValidateEmail :visible="visible" centered @cancel="visible = false">
    </ModalValidateEmail>
  </div>
</template>

<script>
import { get } from 'lodash';
import { mapState, mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import validateEmailExisted from '~/mixins/validate-email-existed';

import {
  required,
  requiredIf,
  minValue,
  email,
  minLength,
  maxLength,
  numeric
} from 'vuelidate/lib/validators';

import {
  DATE_DISPLAY_FORMAT,
  DATE_TIME_FORMAT,
  RES_STATUS_SUCCESS
} from '~/utils/configs';
import moment from 'moment';
import AppDatePicker from '~/components/app/AppDatePicker';
import InputWithCounter from '~/components/pages/common/InputWithCounter';
import ModalValidateEmail from '~/components/modals/ModalValidateEmail';

export default {
  components: {
    AppDatePicker,
    InputWithCounter,
    ModalValidateEmail
  },

  mixins: [validationMixin, validateEmailExisted],

  data() {
    const {
      person_quantity,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      note,
      booking_date,
      booking_hour
    } = this.$route.query;

    return {
      personQuantity: person_quantity ? parseInt(person_quantity) : 0,
      bookingDate: booking_date,
      bookingHour: booking_hour,
      name: customer_name,
      phone: customer_phone,
      nation: nation_id ? parseInt(nation_id) : null,
      email: customer_email,
      note: note,
      visible: false
    };
  },

  async fetch() {
    await this.getUtilitiesNation();
  },

  validations() {
    return {
      name: {
        required,
        maxLength: maxLength(200)
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      email: {
        required,
        email
      },
      personQuantity: {
        required: true,
        minValue: minValue(1)
      },
      bookingDate: {
        required
      },
      bookingHour: {
        required
      }
    };
  },

  watch: {
    'bookingDate': function (value) {
      if (!value) return
      // check is current day
      const currentDate = this.$moment(
        new Date(new Date().setDate(new Date().getDate()))
      ).format('YYYY-MM-DD HH:mm:ss')

      const selectedDate = this.$moment(value, DATE_TIME_FORMAT).format('YYYY-MM-DD')
      const selectedTime = this.$moment(this.$v.bookingHour.$model, DATE_TIME_FORMAT).format('HH:mm:ss')

      const isAfter = this.$moment(`${selectedDate} ${selectedTime}`).isAfter(currentDate)
      if (isAfter) return

      this.$v.bookingHour.$model = this.$moment(
        new Date(new Date().setDate(new Date().getDate() + 1))
      ).format(DATE_TIME_FORMAT)
    } 
  },

  computed: {
    ...mapState('restaurant/restaurant', {
      restaurant: 'restaurant_detail'
    }),
    ...mapState('common/common', [
      'nations',
      'defaultNation',
      'checkMailExist',
    ]),
    ...mapGetters('auth/auth', ['userInfo', 'isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode']),

    startDatesMoment() {
      if (!this.booking_date) return [];
      return this.booking_date.split(',').map((item) => {
        return this.$moment(item.trim(), DATE_TIME_FORMAT);
      });
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
      let openTimes = get(this.restaurant, 'box_data.open_time', {});
      let day = new Date(
        this.$moment(this.bookingDate, 'DD/MM/YYYY HH:mm:ss')
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
        this.$moment(this.bookingHour, 'DD/MM/YYYY HH:mm:ss')
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
          new Date(this.$moment(this.bookingHour, 'DD/MM/YYYY HH:mm:ss'))
        )
          .format('HH:mm')
          .replace(':', '')
      );
      return hour >= start && hour <= end;
    }
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.nation == null && (this.nation = this.defaultNation.id);

    // set default info
    !this.name && (this.name = this.userInfo ? this.userInfo.name : '');
    !this.phone && (this.phone = this.userInfo ? this.userInfo.phone : '');
    !this.email && (this.email = this.userInfo ? this.userInfo.email : '');
  },

  methods: {
    ...mapActions('restaurant/restaurant', ['getrestaurant']),
    ...mapActions('common/transaction', [
      'getTransactionCalculatePricerestaurant'
    ]),
    ...mapActions('common/common', [
      'getUtilitiesNation',
      'getUserCheckEmailExist'
    ]),

    async next() {
      if (!this.checkTime) {
        this.$toast.error(this.$t('restaurant.selecet_time_open'));
        return;
      }

      this.$v.$touch();

      if (this.$v.$invalid) {
        this.$toast.error(this.$t('booking.input_full_infor'));
      } else {
        this.isClickNext = true;
        !this.isValidateEmail && this.nextConfirm();
        // if (!this.isAuthenticated) {
        //   const result = await this.getUserCheckEmailExist({
        //     email: this.email
        //   });
        //   if (result.code === RES_STATUS_SUCCESS) {
        //     if (
        //       result.data.account_status === 1 &&
        //       result.data.account_type === 1
        //     ) {
        //       this.visible = true;
        //     } else {
        //       this.nextConfirm();
        //     }
        //   }
        // } else {
        //   this.nextConfirm();
        // }
      }
    },
    notBeforeNow(event) {
      const TableReservationTime = moment(
        this.$v.bookingDate.$model,
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
    },
    nextConfirm() {
      const query = {
        id: this.restaurant.restaurant_id,
        person_quantity: this.personQuantity,
        customer_name: this.name,
        customer_phone: this.phone,
        nation_id: this.nation,
        customer_email: this.email,
        note: this.note,
        booking_date: this.bookingDate,
        booking_hour: this.bookingHour,
        account_type: get(this.checkMailExist, 'account_type', 0)
      };

      // const path = `/${this.defaultLangCode}/booking/restaurant/confirmation`;
      const cb = () =>
        this.$router.push({
          path: `/${this.defaultLangCode}/booking/restaurant/confirmation`,
          query
        });
      this.$router.replace(
        {
          path: this.$route.path,
          query
        },
        cb,
        cb
      );
      // this.$router.replace(
      //   {
      //     path: path,
      //     query
      //   },
      //   cb,
      //   cb
      // );
    }
  }
};
</script>
