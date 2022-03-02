<template>
  <div class="booking-review">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{ $t('booking.infor_booking_tour') }}</h5>

      <div class="mb-16">
        <!-- {{ tour }} -->
        <label for="datepicker" class="body-1 deep-dark mb-2"
          >{{ $t('tour.date_start') }} <span class="danger">*</span></label
        >
        <v-select
          v-if="tour.departure_type === TOUR_DEPARTURE_TYPE.PLAN"
          v-model="$v.startDate.$model"
          :valid="$v.startDate.$error ? false : null"
          :options="scheduleOpts"
          class="w-100"
          :placeholder="$t('tour.choose_date_start')"
          size="lg"
          @input="handleInputDatePicker"
        />
        <AppDatePicker
          v-else
          v-model="$v.startDate.$model"
          class="w-100"
          size="lg"
          :placeholder="DATE_DISPLAY_FORMAT"
          :disabled-date="setDisabledDate"
          :valid="$v.startDate.$error ? false : null"
          @input="handleInputDatePicker"
        />
      </div>

      <div class="row mb-16">
        <div class="col-md-6">
          <label class="body-1 deep-dark mb-2"
            >{{ $t('booking.number_adult') }}
            <span class="danger">*</span></label
          >
          <InputWithCounter
            v-model="$v.adults.$model"
            type="number"
            :placeholder="$t('booking.input_number')"
            size="lg"
            :valid="$v.adults.$error ? false : null"
          />
        </div>

        <div class="col-md-6">
          <label class="body-1 deep-dark mb-2"
            >{{ $t('booking.number_child') }}
            <span class="danger">*</span></label
          >
          <InputWithCounter
            v-model="$v.children.$model"
            type="number"
            :placeholder="$t('booking.input_number')"
            size="lg"
            :valid="$v.children.$error ? false : null"
          />
        </div>
      </div>

      <v-divider variant="secondary" class="my-24" />

      <div class="text-right body-1 deep-dark">
        {{ $t('booking.payment') }}:
        <span class="secondary ml-16"
          >{{ totalPrice | numeralFormat }} {{ defaultCurrency.code }}</span
        >
      </div>
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

      <div class="row">
        <div class="col-md-6 mb-16">
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

        <div class="col-md-6 mb-16">
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
        <p class="body-1 deep-dark mb-2">
          {{ $t('hotel.email') }} <span class="danger">*</span>
        </p>
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
          :placeholder="$t('booking.more_require_room')"
          rows="1"
        />
      </div>

      <div class="booking-actions mt-24 d-flex justify-content-end">
        <v-button variant="primary" size="lg" @click="next">{{
          $t('header.next')
        }}</v-button>
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
import { TOUR_DEPARTURE_TYPE } from '~/utils/constants';
import AppDatePicker from '~/components/app/AppDatePicker';
import InputWithCounter from '~/components/pages/common/InputWithCounter';
import ModalValidateEmail from '~/components/modals/ModalValidateEmail';
import moment from 'moment';
export default {
  components: {
    AppDatePicker,
    InputWithCounter,
    ModalValidateEmail
  },

  mixins: [validationMixin, validateEmailExisted],

  props: {
    schedule: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    const {
      children,
      adults,
      customer_name,
      customer_phone,
      nation_id,
      customer_email,
      note = '',
      start_date
    } = this.$route.query;

    return {
      adults: adults ? parseInt(adults) : 0,
      children: children ? parseInt(children) : 0,
      startDate: start_date,
      totalPrice: 0,
      timeNow: moment().format('DD/MM/YYYY HH:mm:ss'),
      name: customer_name,
      phone: customer_phone,
      nation: nation_id ? parseInt(nation_id) : null,
      email: customer_email,
      note: note,
      //
      totalPriceLoading: false,
      abc: []
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
      adults: {
        required: requiredIf(function () {
          return !this.children;
        }),
        minValue: this.children ? minValue(0) : minValue(1)
      },
      children: {
        required: requiredIf(function () {
          return !this.adults;
        }),
        minValue: this.adults ? minValue(0) : minValue(1)
      },
      startDate: {
        required
      }
    };
  },
  computed: {
    ...mapState('tour/tour', {
      tour: 'tourDetail'
    }),
    ...mapState('common/common', [
      'nations',
      'defaultNation',
      'defaultCurrency',
      'checkMailExist'
    ]),
    ...mapGetters('auth/auth', ['userInfo', 'isAuthenticated']),

    ...mapGetters('common/common', ['defaultLangCode']),

    scheduleOpts() {
      const { departure_schedule: departureSchedule = [] } = this.tour;
      if (departureSchedule && departureSchedule.length) {
        return departureSchedule.reduce((schedule, item) => {
          const startMoment = this.$moment(item.start_time, DATE_TIME_FORMAT);
          if (startMoment.toDate().getTime() < new Date().getTime())
            return schedule;

          const start = startMoment.format('dd - DD/MM/YYYY');
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
    }
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.TOUR_DEPARTURE_TYPE = Object.freeze(TOUR_DEPARTURE_TYPE);

    this.nation == null && (this.nation = this.defaultNation.id);

    // set default info
    !this.name && (this.name = this.userInfo ? this.userInfo.name : '');
    !this.phone && (this.phone = this.userInfo ? this.userInfo.phone : '');
    !this.email && (this.email = this.userInfo ? this.userInfo.email : '');
    this.calcPriceTour();
  },
  watch: {
    adults: 'calcPriceTour',
    children: 'calcPriceTour'
  },

  methods: {
    // ...mapActions('tour/tour', ['getDetailReset']),
    ...mapActions('common/transaction', ['getTransactionCalculatePriceTour']),
    ...mapActions('common/common', [
      'getUtilitiesNation',
      'getUserCheckEmailExist'
    ]),
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

    async next() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$toast.error(this.$t('booking.input_full_infor'));
      } else {
        this.isClickNext = true;
        !this.isValidateEmail && this.nextConfirm()
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

    nextConfirm() {
      const query = {
        id: this.tour.tour_id,
        children: this.children,
        adults: this.adults,
        customer_name: this.name,
        customer_phone: this.phone,
        nation_id: this.nation,
        customer_email: this.email,
        note: this.note || '',
        start_date: this.startDate,
        total_price: this.totalPrice,
        account_type: get(this.checkMailExist, 'account_type', 0)
      };

      // const path = `/${this.defaultLangCode}/booking/tour/confirmation`;
      const cb = () =>
        this.$router.push(
          this.localePath({ path: `/booking/tour/confirmation`, query })
        );
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
    },

    handleInputDatePicker(date) {
      if (!date) return;
      const { path, query } = this.$route;

      this.$router.replace(
        {
          path,
          query: { ...query, start_date: date }
        },
        this.calcPriceTour,
        this.calcPriceTour
      );
    },
    async calcPriceTour() {
      const { id } = this.$route.query;
      if (this.startDate == null) return;
      this.totalPriceLoading = true;
      const result = await this.getTransactionCalculatePriceTour({
        currency_id: this.defaultCurrency.id,
        product_id: id,
        departure_date: this.startDate,
        adult_quantity: this.adults || 0,
        children_quantity: this.children || 0
      });

      if (result.code === RES_STATUS_SUCCESS) {
        this.totalPrice = result.data;
      } else {
        this.$toast.error(result.message);
      }
      this.totalPriceLoading = false;
    }
  }
};
</script>
