<template>
  <div class="form-auth">
    <a href="" class="form-auth__back" @click.prevent="handleBack">
      <IconLeftArrow2 class="icon" />
    </a>

    <h1 class="form-auth__heading">{{$t("header.forget_pass")}}</h1>

    <div class="form-auth__item text-center">
      {{$t("header.put_email_send_code")}}
    </div>

    <div class="form-auth__item">
      <label class="form-auth__label" for="username">{{$t("header.email")}}</label>
      <v-input
        class="form-auth__input"
        id="username"
        size="lg"
        :placeholder="$t('header.input_email')"
        name="username"
        rounded
        v-model="email"
        :valid="errorEmail ? false : null"
        @input="handleEmail"
      />
      <span class="danger caption" v-if="messageErrorEmail">{{
        messageErrorEmail
      }}</span>
    </div>

    <div class="form-auth__item form-auth__item--action mb-0">
      <v-button
        type="button"
        size="lg"
        variant="primary"
        class="w-100"
        rounded
        :disabled="disableBtn"
        @click.prevent="handleForgot"
        :loading="loadingBtn"
        >{{$t("header.next")}}</v-button
      >
    </div>
  </div>
</template>

<script>
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { mapActions, mapMutations } from 'vuex';
import { required, email } from 'vuelidate/lib/validators';
import IconLeftArrow2 from '~/assets/icons/left-arrow-2.svg?inline';

export default {
  components: {
    IconLeftArrow2
  },

  data() {
    return {
      email: '',
      errorEmail: false,
      messageErrorEmail: '',
      loadingBtn: false
    };
  },
  validations() {
    return {
      email: {
        required,
        email
      }
    };
  },
  computed: {
    disableBtn() {
      return this.$v.$invalid || this.loadingBtn;
    }
  },
  methods: {
    ...mapMutations('common/eventBus', [
      'setModalForgetOtp',
      'setModalForget',
      'setModalSignin'
    ]),
    ...mapActions('auth/auth', ['postUserForgetPw']),
    handleBack() {
      this.setModalForget(false);
      this.setModalSignin(true);
    },
    handleEmail(val) {
      this.email = val.toLowerCase();
      if (!this.$v.email.required) {
        this.errorEmail = true;
        this.messageErrorEmail = this.$t("header.field_require");
      } else if (!this.$v.email.email) {
        this.errorEmail = true;
        this.messageErrorEmail = this.$t("header.invalid_email");
      } else {
        this.errorEmail = false;
        this.messageErrorEmail = '';
      }
    },
    async handleForgot() {
      this.loadingBtn = true;
      const payload = {
        email: this.email
      };
      const result = await this.postUserForgetPw(payload);

      if (result.code != RES_STATUS_SUCCESS) {
        this.loadingBtn = false;
        this.$toasted.error(result.message);
      } else {
        this.loadingBtn = false;
        this.setModalForget(false);
        this.setModalForgetOtp(true);
        // this.$toasted.info('Đăng nhập thành công');
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>
