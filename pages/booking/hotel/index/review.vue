<template>
  <div class="booking-review">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{ $t('booking.infor_booking_room') }}</h5>

      <div class="d-flex justify-content-between">
        <div class="mb-16 flex-grow mr-2">
          <label for="datepicker" class="body-1 deep-dark mb-2"
            >{{ $t('booking.booking_time_2') }}
            <span class="danger">*</span></label
          >
          <AppDatePicker
            v-model="$v.startDate.$model"
            class="w-100"
            size="lg"
            :placeholder="DATE_DISPLAY_FORMAT"
            :valid="$v.startDate.$error ? false : null"
            :disabled-date="disableBeforeToday"
          />
        </div>

        <div class="mb-16 flex-grow ml-2">
          <label
            for="datepicker"
            class="body-1 mb-2 d-flex justify-content-end secondary"
            >{{ $t('booking.still') }} {{ roomAvailable }}
            {{ $t('booking.empty_room') }}</label
          >
          <AppDatePicker
            v-model="$v.endDate.$model"
            class="w-100"
            size="lg"
            :placeholder="DATE_DISPLAY_FORMAT"
            :disabled-date="disableBeforeTodayOut"
            :valid="$v.endDate.$error ? false : null"
          />
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <div class="mb-16 flex-grow mr-2">
          <label class="body-1 deep-dark mb-2"
            >{{ $t('booking.number_room') }}
            <span class="danger">*</span></label
          >
          <InputWithCounter
            :disabled="roomAvailable === 0"
            v-model="$v.numberRoomBooked.$model"
            type="number"
            :placeholder="$t('booking.input_number')"
            size="lg"
            :valid="$v.numberRoomBooked.$error ? false : null"
          />
        </div>
        <div class="mb-16 flex-grow mr-2">
          <label class="body-1 deep-dark mb-2">{{
            $t('booking.number_guest')
          }}</label>
          <InputWithCounter
            :disabled="roomAvailable === 0"
            v-model="$v.numberPersonBooked.$model"
            type="number"
            :placeholder="$t('booking.number_guest')"
            size="lg"
            :valid="$v.numberPersonBooked.$error ? false : null"
          />
          <span v-if="$v.numberPersonBooked.$error && numberPersonBooked > 0" class="danger caption">{{
            $t('booking.booked_is_exceeded')
          }}</span>
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
          v-if="$v.email.$model && !$v.email.required"
          class="danger caption"
          >{{ $t('booking.obligatory') }}</span
        >
        <span
          v-if="$v.email.$model && !$v.email.email"
          class="danger caption"
          >{{ $t('booking.right_email') }}</span
        >
      </div>

      <div class="mb-16">
        <v-checkbox
          @change="isGuest = !isGuest"
          :checked="isGuest"
          class="form-auth__checkbox"
          >{{ $t('booking.i_am_guest') }}</v-checkbox
        >
      </div>

      <div class="mb-16">
        <p class="body-1 deep-dark mb-2">
          {{ $t('booking.name_guest') }} <span class="danger">*</span>
        </p>
        <v-input
          v-model="vModelGuest.$model"
          :readonly="isGuest"
          size="lg"
          :placeholder="$t('booking.input_name_passport')"
          :valid="vModelGuest.$error ? false : null"
        />
        <span
          v-if="vModelGuest.$error && !vModelGuest.required"
          class="danger caption"
          >{{ $t('booking.obligatory') }}</span
        >
        <span
          v-if="vModelGuest.$error && !vModelGuest.maxLength"
          class="danger caption"
          >{{ $t('booking.name_guest_exceed') }}</span
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
        <v-button
          :disabled="roomAvailable === 0"
          variant="primary"
          size="lg"
          @click="next"
          >{{ $t('header.next') }}</v-button
        >
      </div>
    </div>

    <ModalValidateEmail :visible="visible" centered @cancel="visible = false">
    </ModalValidateEmail>
  </div>
</template>

<script>
import { get, values, isEmpty, every, some } from 'lodash';
import { mapState, mapGetters, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import validateEmailExisted from '~/mixins/validate-email-existed';

import {
  required,
  requiredIf,
  minValue,
  email,
  maxValue,
  maxLength,
  minLength,
  numeric
} from 'vuelidate/lib/validators';

import {
  DATE_DISPLAY_FORMAT,
  DATE_TIME_FORMAT,
  RES_STATUS_SUCCESS
} from '~/utils/configs';
import AppDatePicker from '~/components/app/AppDatePicker';
import InputWithCounter from '~/components/pages/common/InputWithCounter';
import ModalValidateEmail from '~/components/modals/ModalValidateEmail';
import * as configs from '~/utils/configs';

export default {
  components: {
    AppDatePicker,
    InputWithCounter,
    ModalValidateEmail
  },

  mixins: [validationMixin, validateEmailExisted],

  props: {
    restRoom: {
      type: Object,
      default: () => ({})
    }
  },

  async asyncData({ route, store }) {
    const { start_date, end_date, hotel_id, room_id } = route.query;
    if (!start_date || !end_date) return;
    const res = await store.dispatch('hotel/hotel/getHotelBookingCheckHotel', {
      hotel_id: hotel_id,
      check_in: start_date,
      check_out: end_date
    });
    const rooms = res.data.find((item) => item.roomId == room_id);
    return {
      roomAvailable: rooms && rooms.roomAvailable ? rooms.roomAvailable : 0
    };
  },

  data() {
    const {
      hotel_id,
      customer_name,
      guest_name,
      is_guest,
      customer_phone,
      nation_id,
      customer_email,
      note,
      start_date,
      end_date,
      number_room_booked,
      number_person_booked,
      number_room_available
    } = this.$route.query;

    return {
      startDate: start_date,
      endDate: end_date,
      number_room_available: number_room_available
        ? parseInt(number_room_available)
        : 0,
      numberRoomBooked: 0,
      numberPersonBooked: 0,
      hotelId: hotel_id ? parseInt(hotel_id) : null,
      name: customer_name,
      guestName: guest_name,
      isGuest: is_guest == 'true',
      phone: customer_phone,
      nation: nation_id ? parseInt(nation_id) : null,
      email: customer_email,
      note: note,
      totalPriceLoading: false,
      totalPrice: 0
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
      guestName: {
        required: requiredIf(function () {
          return !this.isGuest;
        }),
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
      startDate: {
        required: requiredIf(function () {
          return !this.startDate;
        })
      },
      endDate: {
        required: requiredIf(function () {
          return !this.endDate;
        })
      },
      numberRoomBooked: {
        required: requiredIf(function () {
          return !this.numberRoomBooked;
        }),
        minValue: this.numberRoomBooked ? minValue(0) : minValue(1),
        maxValue: maxValue(this.roomAvailable)
      },
      numberPersonBooked: {
        required: requiredIf(function () {
          return !this.numberPersonBooked;
        }),
        minValue: this.numberPersonBooked ? minValue(0) : minValue(1),
        maxValue: maxValue(this.personNumberAvaiable * this.numberRoomBooked)
      }
    };
  },

  computed: {
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail'
    }),
    ...mapState('common/common', [
      'nations',
      'defaultNation',
      'defaultCurrency',
      'checkMailExist'
    ]),
    ...mapGetters('auth/auth', ['userName', 'userInfo', 'isAuthenticated']),
    ...mapGetters('common/common', ['defaultLangCode']),
    personNumberAvaiable() {
      if (!this.restRoom) return 0;
      const number =
        this.restRoom.number_adults + this.restRoom.number_children;
      return number || 0;
    },

    vModelGuest: {
      get() {
        return this.isGuest ? this.$v.name : this.$v.guestName;
      },
      set(newName) {
        return this.isGuest ? this.$v.name.$model : this.$v.guestName.$model;
      }
    },

    vValidate() {
      return this.isGuest ? this.$v.name.$error : this.$v.guestName.$error;
    }
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;
    this.nation == null && (this.nation = this.defaultNation.id);

    // set default info
    !this.name && (this.name = this.userInfo ? this.userInfo.name : '');
    !this.phone && (this.phone = this.userInfo ? this.userInfo.phone : '');
    !this.email && (this.email = this.userInfo ? this.userInfo.email : '');

    this.setUpNumber();
  },

  watch: {
    numberRoomBooked: 'calcPriceHotel',

    userInfo(newVal) {
      !this.name && (this.name = newVal ? newVal.name : '');
      !this.phone && (this.phone = newVal ? newVal.phone : '');
      !this.email && (this.email = newVal ? newVal.email : '');
    },

    startDate(newVal) {
      if (newVal) {
        // this.calcPriceHotel();
        this.getRoomAvailable();
      }
    },

    endDate(newVal) {
      if (newVal) {
        // this.calcPriceHotel();
        this.getRoomAvailable();
      }
    }
  },

  methods: {
    ...mapActions('hotel/hotel', [
      'getTourDetail',
      'postHotelBookingCheck',
      'getHotelBookingCheckHotel'
    ]),
    ...mapActions('common/transaction', ['getTransactionCalculatePriceHotel']),
    ...mapActions('common/common', [
      'getUtilitiesNation',
      'getUserCheckEmailExist'
    ]),

    setNumberRoomBooked(_numb) {
      if (!_numb) return 0;
      if (this.roomAvailable > parseInt(_numb)) {
        return parseInt(_numb);
      } else {
        return this.roomAvailable;
      }
    },

    setNumberPersonBooked(_numb) {
      if (!_numb) return 0;
      if (this.roomAvailable * this.personNumberAvaiable > parseInt(_numb)) {
        return parseInt(_numb);
      } else {
        return this.roomAvailable;
      }
    },

    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (this.endDate === null) {
        return date < today;
      } else {
        const dateDisable = this.$moment(
          this.endDate,
          'DD/MM/YYYY HH:mm:ss'
        ).format('MM-DD-YYYY HH:mm:ss');
        return (
          date < today ||
          date >
            Date.parse(dateDisable.replace(/-/g, '/').replace(/[a-z]+/gi, ' '))
        );
      }
    },

    disableBeforeTodayOut(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (this.startDate === null) {
        return date < today;
      } else {
        const dateDisable = this.$moment(
          this.startDate,
          'DD/MM/YYYY HH:mm:ss'
        ).format('MM-DD-YYYY HH:mm:ss');
        return (
          date < today ||
          date <
            Date.parse(dateDisable.replace(/-/g, '/').replace(/[a-z]+/gi, ' '))
        );
      }
    },

    async next() {
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

    nextConfirm() {
      const query = {
        hotel_id: this.hotel.hotel_id,
        room_id: this.restRoom.rest_room_id, // able change value
        customer_name: this.name,
        guest_name: this.isGuest ? this.name : this.guestName,
        is_guest: this.isGuest,
        customer_phone: this.phone,
        nation_id: this.nation,
        customer_email: this.email,
        note: this.note || '',
        start_date: this.startDate,
        end_date: this.endDate,
        total_price: this.totalPrice,
        number_room_booked: this.numberRoomBooked,
        number_person_booked: this.numberPersonBooked,
        number_room_available: this.roomAvailable,
        account_type: get(this.checkMailExist, 'account_type', 0)
      };

      const payload = {
        rest_room_id: this.$route.query.room_id,
        room_quantity: this.numberRoomBooked,
        check_in: this.startDate,
        check_out: this.endDate
      };
      this.postHotelBookingCheck(payload).then((result) => {
        if (result.code === RES_STATUS_SUCCESS) {
          const cb = () =>
            this.$router.push({
              path: `/${this.defaultLangCode}/booking/hotel/confirmation`,
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
        } else {
          this.$toast.error(result.message);
        }
      });
    },

    handleInputDatePicker(date) {
      if (!date) return;
      const { path, query } = this.$route;
      const dateOnlyDate = date.split(' ')[0];
      const matchedSchedule =
        this.hotel.departure_schedule.find(
          (item) => item.start_time.split(' ')[0] == dateOnlyDate
        ) || {};

      this.$router.replace(
        {
          path,
          query: { ...query, schedule_id: matchedSchedule.id }
        },
        this.calcPriceHotel,
        this.calcPriceHotel
      );
    },

    async calcPriceHotel() {
      const { id } = this.$route.query.room_id;
      this.totalPriceLoading = true;
      if (isEmpty(this.startDate) || isEmpty(this.endDate)) {
        this.totalPrice = 0;
        return;
      }
      const result = await this.getTransactionCalculatePriceHotel({
        currency_id: this.defaultCurrency.id,
        room_id: this.$route.query.room_id,
        quantity: isNaN(this.numberRoomBooked) ? 0 : this.numberRoomBooked,
        start_time: this.startDate,
        end_time: this.endDate
      });
      if (result.code === RES_STATUS_SUCCESS) {
        this.totalPrice = result.data;
      } else {
        this.$toast.error(result.message);
      }
      this.totalPriceLoading = false;
    },

    async getRoomAvailable() {
      const { room_id } = this.$route.query;
      if (!this.startDate || !this.endDate) return;
      const res = await this.getHotelBookingCheckHotel({
        hotel_id: this.hotelId,
        check_in: this.startDate,
        check_out: this.endDate
      });
      if (res.code === configs.RES_STATUS_SUCCESS) {
        const rooms = res.data.find((item) => item.roomId == room_id);
        this.roomAvailable =
          rooms && rooms.roomAvailable ? rooms.roomAvailable : 0;
        this.setUpNumber();
      }
    },

    setUpNumber() {
      if (this.roomAvailable && this.roomAvailable > 0) {
        this.$v.numberRoomBooked.$model = this.setNumberRoomBooked(
          this.$route.query.number_room_booked
        );
        this.$v.numberPersonBooked.$model = this.setNumberPersonBooked(
          this.$route.query.number_person_booked
        );
        this.calcPriceHotel();
      }
    }
  }
};
</script>