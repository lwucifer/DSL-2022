<template>
  <div class="booking-review">
    <div class="bg-white pa-16 mb-2">
      <h5 class="mb-16">{{ $t('booking.infor_booking_product') }}</h5>
      <div class="mb-16">
        <label for="amount" class="body-1 deep-dark mb-2"
          >{{ $t('product.number') }} <span class="danger">*</span></label
        >
        <InputWithCounter
          v-model="$v.amount.$model"
          id="amount"
          type="number"
          :placeholder="$t('booking.input_number')"
          size="lg"
          :valid="$v.amount.$error ? false : null"
        />
        <span
          v-if="$v.amount.$error && !$v.amount.required"
          class="danger caption"
          >{{ $t('booking.obligatory') }}</span
        >
      </div>

      <v-divider variant="secondary" class="my-24" />

      <div class="text-right body-1 deep-dark">
        {{ $t('booking.payment') }}:

        <span class="secondary ml-16"
          >{{
            totalPrice | priceTransform(currentExchangeRate) | numeralFormat
          }}
          {{ currentUnitCode }}</span
        >
      </div>
    </div>

    <div class="bg-white pa-16">
      <h5 class="mb-16">{{ $t('booking.infor_contact') }}</h5>

      <div class="mb-16">
        <label for="name" class="body-1 deep-dark mb-2">
          {{ $t('booking.receipt_information') }} <span class="danger">*</span>
        </label>
        <v-input
          v-model="$v.name.$model"
          id="name"
          size="lg"
          :placeholder="$t('booking.input_name_of_consignee')"
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
          >{{ $t('booking.consignee_length_exceed') }}</span
        >
      </div>

      <div class="row mb-16">
        <div class="col-md-6">
          <p class="body-1 deep-dark mb-2">
            {{ $t('booking.phone_number') }} <span class="danger">*</span>
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
          <p class="body-1 deep-dark mb-2">
            Email <span class="danger">*</span>
          </p>
          <v-input
            v-model.trim="$v.email.$model"
            size="lg"
            :placeholder="$t('booking.input_email')"
            :valid="$v.email.$error ? false : null"
            @input="$v.email.$model = $v.email.$model.toLowerCase()"
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
      </div>

      <div class="row">
        <div class="col-12">
          <label class="body-1 deep-dark mb-2"
            >{{ $t('booking.shipping_address') }}
            <span class="danger">*</span></label
          >
        </div>

        <div class="col-md-6 col-xl-4 mb-16">
          <v-select
            v-model="$v.city.$model"
            id="city"
            class="w-100"
            size="lg"
            :placeholder="$t('booking.city')"
            searchable
            :options="selectAreas"
            :disabled="getAtStore"
            :valid="$v.city.$error ? false : null"
          />
          <span
            v-if="$v.city.$error && !$v.city.required"
            class="danger caption"
            >{{ $t('booking.obligatory') }}</span
          >
        </div>

        <div class="col-md-6 col-xl-4 mb-16">
          <v-select
            v-model="$v.district.$model"
            id="district"
            class="w-100"
            size="lg"
            :placeholder="$t('booking.district')"
            searchable
            :empty-message="$t('booking.select_city_first')"
            :options="selectDistrict"
            :disabled="getAtStore"
            :valid="$v.district.$error ? false : null"
          />
          <span
            v-if="$v.district.$error && !$v.district.required"
            class="danger caption"
            >{{ $t('booking.obligatory') }}</span
          >
        </div>

        <div class="col-md-6 col-xl-4 mb-16">
          <v-select
            v-model="$v.ward.$model"
            id="ward"
            class="w-100"
            size="lg"
            :placeholder="$t('booking.ward')"
            searchable
            :empty-message="$t('booking.select_district_first')"
            :options="selectWard"
            :disabled="getAtStore"
            :valid="$v.ward.$error ? false : null"
          />
          <span
            v-if="$v.ward.$error && !$v.ward.required"
            class="danger caption"
            >{{ $t('booking.obligatory') }}</span
          >
        </div>

        <div class="col-12 mb-16">
          <v-input
            v-model="$v.address.$model"
            size="lg"
            :placeholder="$t('booking.shipping_address')"
            :valid="$v.address.$error ? false : null"
          />
          <span
            v-if="$v.address.$error && !$v.address.required"
            class="danger caption"
            >{{ $t('booking.obligatory') }}</span
          >
        </div>

        <div class="col-12 mb-16">
          <v-checkbox
            v-model="getAtStore"
            class="body-1 fw-bold mb-0"
            :value="true"
            >{{ $t('booking.receive_at_store') }}</v-checkbox
          >
        </div>
      </div>

      <div class="mb-16">
        <p class="body-1 deep-dark mb-2">{{ $t('booking.note_2') }}</p>
        <v-textarea
          v-model="note"
          size="lg"
          :placeholder="$t('booking.product_note_placeholder')"
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
  numeric,
  integer
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

export default {
  components: {
    AppDatePicker,
    InputWithCounter,
    ModalValidateEmail
  },

  mixins: [validationMixin, validateEmailExisted],

  // props: {
  //   productPrice: {
  //     type: Number,
  //     default: 0
  //   }
  // },

  data() {
    const {
      amount = 1,
      // discount_code = '',
      customer_name = '',
      customer_phone = '',
      customer_email = '',
      ward = null,
      district = null,
      city = null,
      address = '',
      get_at_store = null,
      note = ''
    } = this.$route.query;

    return {
      totalPrice: 0,
      //
      amount: amount ? parseInt(amount) : 1,
      // discountCode: discount_code,
      name: customer_name,
      phone: customer_phone,
      email: customer_email,
      ward: ward ? parseInt(ward) : null,
      district: district ? parseInt(district) : null,
      city: city ? parseInt(city) : null,
      address,
      getAtStore: get_at_store == 'true',
      note,
      //
      totalPriceLoading: false
    };
  },

  async fetch() {
    const { city_code, district_code } = this.$route.query;

    await Promise.all([
      this.getUtilitiesArea(),
      city_code != null && this.getUtilitiesDistrict({ city_code }),
      district_code != null && this.getUtilitiesWard({ district_code })
    ]);
  },

  validations() {
    return {
      amount: {
        required,
        integer,
        minValue: minValue(1)
      },
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
      ward: {
        required: requiredIf(function () {
          return !this.getAtStore;
        })
      },
      district: {
        required: requiredIf(function () {
          return !this.getAtStore;
        })
      },
      city: {
        required: requiredIf(function () {
          return !this.getAtStore;
        })
      },
      address: {
        required: requiredIf(function () {
          return !this.getAtStore;
        })
      }
    };
  },

  computed: {
    ...mapState('common/common', [
      // 'nations',
      'defaultNation',
      'defaultCurrency',
      'checkMailExist'
    ]),
    ...mapState('common/selectbox', {
      areaList: 'areas',
      districtList: 'district'
    }),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    ...mapGetters('common/selectbox', [
      'selectAreas',
      'selectDistrict',
      'selectWard'
    ]),
    ...mapGetters('auth/auth', ['userInfo']),
    ...mapGetters('productTravel/productTravel', {
      product: 'productTravelDetail'
    })
  },

  created() {
    this.DATE_DISPLAY_FORMAT = DATE_DISPLAY_FORMAT;

    // set default info
    !this.name && (this.name = this.userInfo ? this.userInfo.name : '');
    !this.phone && (this.phone = this.userInfo ? this.userInfo.phone : '');
    !this.email && (this.email = this.userInfo ? this.userInfo.email : '');
    setTimeout(() => {
      this.calcPriceTotal();
    }, 1000);
  },

  watch: {
    amount: 'calcPriceTotal',
    // discountCode: 'calcPriceTotal',

    city(newValue) {
      this.district = null;
      this.ward = null;
      const area = this.areaList.find((item) => item.id === newValue);
      if (area && area.code) {
        this.getUtilitiesDistrict({ province_code: area.code });
      }
    },

    district(newValue) {
      this.ward = null;
      const district = this.districtList.find((item) => item.id === newValue);
      if (district && district.code) {
        this.getUtilitiesWard({ district_code: district.code });
      }
    }
  },

  methods: {
    // ...mapActions('common/transaction', ['getTransactionCalculatePriceTour']),
    // ...mapActions('common/common', ['getUtilitiesNation']),
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesDistrict',
      'getUtilitiesWard'
    ]),

    async next() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
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
      const cityObj = this.areaList.find((item) => item.id === this.city);
      const districtObj = this.districtList.find(
        (item) => item.id === this.district
      );
      const cityCode = cityObj ? cityObj.code : null;
      const districtCode = districtObj ? districtObj.code : null;

      const query = {
        id: this.product.productId,
        amount: this.amount,
        // discount_code: this.discountCode,
        customer_name: this.name,
        customer_phone: this.phone,
        customer_email: this.email,
        ward: !this.getAtStore ? this.ward : null,
        district: !this.getAtStore ? this.district : null,
        city: !this.getAtStore ? this.city : null,
        address: this.address,
        note: this.note || '',
        get_at_store: this.getAtStore,
        total_price: this.totalPrice,
        city_code: cityCode,
        district_code: districtCode,
        account_type: get(this.checkMailExist, 'account_type', 0)
      };

      // const path = `/${this.defaultLangCode}/booking/product-travel/confirmation`;
      const cb = () =>
        this.$router.push({
          path: `/${this.defaultLangCode}/booking/product-travel/confirmation`,
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
    },
    calcPriceTotal() {
      this.totalPrice = Number(this.amount) * Number(this.product.price);
    }
  }
};
</script>
