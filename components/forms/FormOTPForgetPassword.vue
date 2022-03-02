<template>
  <div class="form-auth pb-3">
    <a href="" class="form-auth__back" @click.prevent="handleBack">
      <IconLeftArrow2 class="icon" />
    </a>
    <h1 class="form-auth__heading">{{$t("header.forget_pass")}}</h1>

    <div class="form-auth__item text-center">
      {{$t("header.sent_auth_code")}}
    </div>

    <div class="form-auth__item">
      <label class="form-auth__label body-1">{{$t("header.input_auth_code")}}</label>

      <div class="fofp-input-group">
        <div
          class="fofp-input-item"
          v-for="(i, index) in NUM_OF_INPUTS"
          :key="index"
        >
          <v-input
            ref="input"
            class="form-auth__input"
            size="lg"
            maxlength="1"
            rounded
            name="otp_input_forget"
            @keyup="(event) => handleKeyUp(event, index)"
          />
        </div>
      </div>
    </div>

    <div class="form-auth__item form-auth__item--action mb-0">
      <v-button
        type="button"
        size="lg"
        variant="primary"
        class="w-100"
        rounded
        @click="handleSubmit"
        >{{$t("header.next")}}</v-button
      >
      <div class="fofp-resend-otp">
        <a href="" @click.prevent="handleResendOtp">{{$t("header.resend_auth_code")}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { dispatchForCode } from '~/utils/common';
import { mapState, mapMutations, mapActions } from 'vuex';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { get } from 'lodash';
import IconLeftArrow2 from '~/assets/icons/left-arrow-2.svg?inline';

const NUM_OF_INPUTS = 6;

export default {
  components: {
    IconLeftArrow2
  },
  data() {
    const inputValues = new Array(NUM_OF_INPUTS).fill(null, 0, NUM_OF_INPUTS);

    return {
      inputValues
    };
  },

  computed: {
    ...mapState('auth/auth', ['forgetPayload', 'sessionIdForgot'])
  },

  created() {
    this.NUM_OF_INPUTS = NUM_OF_INPUTS;
  },

  methods: {
    ...mapActions('auth/auth', [
      'postUserForgetPwOtpVerify',
      'postUserForgetPwOtpResend'
    ]),
    ...mapMutations('common/eventBus', [
      'setModalInputNewPass',
      'setModalForgetOtp',
      'setModalForget'
    ]),
    ...mapMutations('auth/auth', ['setSessionIdForgot']),
    handleBack() {
      this.setModalForgetOtp(false);
      this.setModalForget(true);
    },
    async handleResendOtp() {
      const result = await this.postUserForgetPwOtpResend({
        email: get(this, 'forgetPayload.email', null)
      });
      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
      } else {
        this.setSessionIdForgot(get(result, 'data', null));
        this.$toasted.info(this.$t('header.success_resend_auth_code'));
      }
    },
    handleKeyUp(event, index) {
      const {
        target: { value }
      } = event;
      const except = [' ', ''];

      //
      if (!except.includes(value)) {
        if (index < this.NUM_OF_INPUTS - 1) {
          const nextVInputEl = this.$refs.input[index + 1].$el;
          const input = nextVInputEl.getElementsByTagName('input')[0];
          input.focus();
        } else {
          console.log('validate and submit');
        }
      }

      //
      dispatchForCode(event, (code) => {
        if (code === 'Backspace' || code === 8) {
          if (!value && index > 0) {
            const prevInputEl = this.$refs.input[index - 1].$el;
            const input = prevInputEl.getElementsByTagName('input')[0];
            input.focus();
          }
        }
      });
    },
    async handleSubmit() {
      const inputEls = document.getElementsByName('otp_input_forget');
      const code = Array.from(inputEls)
        .map((e) => e.value)
        .reduce((a, c) => `${a}${c}`, '')
        .trim();
      const result = await this.postUserForgetPwOtpVerify({
        otp: code,
        session_id: get(this, 'sessionIdForgot', null)
      });

      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
      } else {
        this.setModalForgetOtp(false);
        this.setModalInputNewPass(true);
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>

<style lang="scss" scoped>
@import '~/assets/scss/components/forms/_form-otp-forget-password.scss';
</style>
