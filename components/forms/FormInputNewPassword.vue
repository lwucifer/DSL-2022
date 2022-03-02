<template>
  <div class="form-auth">
    <a href="" class="form-auth__back" @click.prevent="handleBack">
      <IconLeftArrow2 class="icon" />
    </a>
    <h1 class="form-auth__heading">{{$t("header.make_new_pass")}}</h1>

    <div class="form-auth__item">
      <label class="form-auth__label" for="new-password"
        >{{$t("header.make_new_pass")}}</label
      >
      <v-input
        type="password"
        class="form-auth__input"
        id="new-password"
        size="lg"
        :placeholder="$t('header.input_new_pass')"
        rounded
        autocomplete="off"
        v-model="newPassword"
        :valid="errorNewPassword ? false : null"
        @input="handleNewPassword"
      />
      <span class="danger caption" v-if="messageErrorNewPass">{{
        messageErrorNewPass
      }}</span>
    </div>

    <div class="form-auth__item">
      <label class="form-auth__label" for="re-new-password"
        >{{$t("header.confirm_pass")}}</label
      >
      <v-input
        type="password"
        class="form-auth__input"
        id="re-new-password"
        size="lg"
        :placeholder="$t('header.confirm_pass')"
        rounded
        autocomplete="off"
        v-model="reNewPassword"
        :valid="errorReNewPassword ? false : null"
        @input="handleReNewPassword"
      />
      <span class="danger caption" v-if="messageErrorReNewPass">{{
        messageErrorReNewPass
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
        @click="handleSubmit"
        >{{$t("header.finish")}}</v-button
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { validatePassword } from '~/utils/validations';
import { required, sameAs } from 'vuelidate/lib/validators';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import IconLeftArrow2 from '~/assets/icons/left-arrow-2.svg?inline';

import { get } from 'lodash';
export default {
  components: {
    IconLeftArrow2
  },
  data() {
    return {
      newPassword: '',
      errorNewPassword: false,
      messageErrorNewPass: '',
      reNewPassword: '',
      errorReNewPassword: false,
      messageErrorReNewPass: ''
    };
  },

  validations() {
    return {
      newPassword: {
        required
      },
      reNewPassword: {
        required,
        sameAsNewPassword: sameAs('newPassword')
      }
    };
  },
  computed: {
    ...mapState('auth/auth', ['forgetPayload', 'sessionIdForgot']),
    disableBtn() {
      return this.$v.$invalid;
    }
  },
  methods: {
    ...mapActions('auth/auth', [
      'postUserForgetPwChangePw',
      'postUserLogin',
      'postUserUpdateFirebaseToken'
    ]),
    ...mapMutations('common/eventBus', [
      'setModalSignin',
      'setModalInputNewPass',
      'setModalForgetOtp',
      'setModalAuth'
    ]),
    handleBack() {
      this.setModalInputNewPass(false);
      this.setModalForgetOtp(true);
    },
    handleNewPassword(value) {
      if (!validatePassword(value)) {
        this.messageErrorNewPass = this.$t("header.err_pass");
        this.errorNewPassword = true;
      } else {
        this.messageErrorNewPass = '';
        this.errorNewPassword = false;
      }
    },
    handleReNewPassword(value) {
      if (!this.$v.reNewPassword.sameAsNewPassword) {
        this.messageErrorReNewPass = this.$t("header.pass_not_match");
        this.errorReNewPassword = true;
      } else {
        this.messageErrorReNewPass = '';
        this.errorReNewPassword = false;
      }
    },
    async handleSubmit() {
      const result = await this.postUserForgetPwChangePw({
        new_password: this.newPassword,
        session_id: get(this, 'sessionIdForgot', null)
      });

      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
      } else {
        const payloadLogin = {
          email: this.forgetPayload.email,
          password: this.newPassword,
          remember: 1
        };
        const result = await this.postUserLogin(payloadLogin);
        if (result.code != RES_STATUS_SUCCESS) {
          this.$toasted.error(result.message);
          // this.showMessageErrorSignIn(result);
        } else {
          this.setModalAuth(false);
          this.setModalInputNewPass(false);
          this.$toasted.info(this.$t('header.login_success'));
          this.updateFirebaseToken();
        }
      }
    },

    updateFirebaseToken() {
      this.$fire.messaging
        .requestPermission()
        .then(async (granted) => {
          return await this.$fire.messaging.getToken();
        })
        .then(async (token) => {
          const res = await this.postUserUpdateFirebaseToken({ token });
        })
        .catch((err) => {
        });
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>
