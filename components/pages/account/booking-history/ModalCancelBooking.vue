<template>
  <v-modal
    :width="800"
    centered
    size="lg"
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    @ok="save"
    modal-class="modal-cancel-booking"
  >
    <h3 v-if="dataCheck.productType == 4" class="text-center mb-24 mt-4">
      {{ $t('booking.reason_cancellation') }}
    </h3>
    <h3 v-else class="text-center mb-24 mt-4">
      {{ $t('booking.reason_cancel') }}
    </h3>
    <v-radio-group v-model="reason" name="reason">
      <v-radio
        v-if="dataCheck.productType == 4"
        :value="$t('booking.another_products')"
        class="d-inline-block mb-24 mr-5 body-1"
      >
        {{ $t('booking.another_products') }}
      </v-radio>
      <v-radio
        v-else
        :value="$t('booking.another_schedule')"
        class="d-inline-block mb-24 mr-5 body-1"
      >
        {{ $t('booking.another_schedule') }}
      </v-radio>
      <v-radio
        :value="$t('booking.chose_another_service')"
        class="d-inline-block mb-24 body-1"
      >
        {{ $t('booking.chose_another_service') }}
      </v-radio>
      <v-radio :value="$t('booking.another_reason')" class="mb-24 body-1">
        {{ $t('booking.another_reason') }}
      </v-radio>
    </v-radio-group>

    <v-input
      class="mb-24"
      :placeholder="$t('booking.input_another_reason')"
      size="lg"
      :disabled="checkDisabled(reason)"
      v-model="anotherReason"
      :valid="errorReNewPassword ? false : null"
      @input="handleNowPassword(anotherReason)"
    ></v-input>
    <span class="danger caption" v-if="errorReNewPassword">{{
      messageErrorReNewPass
    }}</span>
    <div class="body-1" v-if="dataCheck.order_status === 3">
      <strong>
        {{ $t('booking.provider_contact_refund') }}
      </strong>
      <p>{{ $t('booking.any_questions') }}:</p>
      <p>
        -
        {{
          dataCheck.phone == null
            ? $t('booking.hotline')
            : $t('hotel.phone_number') + dataCheck.phone
        }}
      </p>
      <p>
        - Email:
        <a class="fw-bold primary" href="#">{{
          dataCheck.email == null ? '' : dataCheck.email
        }}</a>
      </p>
    </div>
    <slot></slot>
  </v-modal>
</template>

<script>
export default {
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  methods: {
    save() {
      if (
        !this.anotherReason &&
        this.reason === this.$t('booking.another_reason')
      ) {
        this.messageErrorReNewPass = this.$t('booking.not_empty');
        this.errorReNewPassword = true;
      }
      if (!this.errorReNewPassword) {
        this.$emit(
          'confirm',
          this.reason === this.$t('booking.another_reason')
            ? this.anotherReason
            : this.reason
        );
      }
    },
    checkDisabled(value) {
      if (
        value === 'Đặt lịch khác' ||
        value === 'Chọn sản phẩm, dịch vụ khác'
      ) {
        return true;
      }
      if (
        value === 'Set another schedule' ||
        value === 'Select another product or service'
      ) {
        return true;
      }
    },
    handleNowPassword(value) {
      if (value == '') {
        this.messageErrorReNewPass = this.$t('booking.not_empty');
        this.errorReNewPassword = true;
      } else {
        this.errorReNewPassword = false;
      }
    }
  },
  props: {
    dataCheck: {
      type: Object,
      default: null
    },
    visible: Boolean
  },
  watch: {
    reason() {
      this.errorReNewPassword = false;
    },
    visible() {
      this.errorReNewPassword = false;
      this.reason = this.$t('booking.another_schedule');
      this.anotherReason = '';
    }
  },
  data() {
    return {
      reason: this.$t('booking.another_schedule'),
      anotherReason: '',
      errorReNewPassword: false,
      messageErrorReNewPass: ''
    };
  }
};
</script>

<style>
</style>