<template>
  <form @submit.prevent="handleLogin">
    <div class="form-auth">
      <h1 class="form-auth__heading">{{ $t('header.login') }}</h1>
      <p class="danger fs-italic" v-show="!!errorMsgOnModalAuth">
        {{ errorMsgOnModalAuth }}
      </p>

      <div class="form-auth__social">
        <v-button
          class="form-auth__social-btn form-auth__social-btn--facebook w-100"
          tag="a"
          :href="fbLoginUrl"
          size="lg"
          rounded
        >
          <span>
            <IconFooterFb class="icon" />
          </span>
          {{ $t('header.login_fb') }}</v-button
        >

        <v-button
          class="form-auth__social-btn form-auth__social-btn--google w-100"
          tag="a"
          :href="ggLoginUrl"
          size="lg"
          rounded
        >
          <span>
            <IconGoogle class="icon" />
          </span>
          {{ $t('header.login_gg') }}</v-button
        >

        <div class="form-auth__social-text">
          <span>{{ $t('header.login_email') }}</span>
        </div>
      </div>

      <div class="form-auth__item">
        <label class="form-auth__label" for="username"
          >{{ $t('header.email') }}<span class="danger">*</span></label
        >
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

      <div class="form-auth__item">
        <label class="form-auth__label" for="password"
          >{{ $t('header.password') }} <span class="danger">*</span></label
        >
        <v-input
          class="form-auth__input"
          id="password"
          :type="typePassword ? 'password' : 'text'"
          size="lg"
          :placeholder="$t('header.password')"
          name="password"
          rounded
          v-model="password"
          :valid="errorPassword ? false : null"
          @input="handlePassword"
        >
          <template slot="append">
            <IconEye2
              v-if="typePassword"
              @click.prevent="typePassword = !typePassword"
            />
            <IconEye v-else @click.prevent="typePassword = !typePassword" />
          </template>
        </v-input>
        <span class="danger caption" v-if="messageErrorPass">{{
          messageErrorPass
        }}</span>
      </div>

      <div
        class="form-auth__item d-flex justify-content-between align-items-center"
      >
        <v-checkbox v-model="keeplogin" class="form-auth__checkbox">{{
          $t('header.keep_login')
        }}</v-checkbox>
        <a href="" @click.prevent="openModalForgot">{{
          $t('header.forget_pass')
        }}</a>
      </div>

      <div class="form-auth__item form-auth__item--action">
        <v-button
          type="submit"
          size="lg"
          variant="primary"
          class="w-100"
          rounded
          @click.prevent="handleLogin"
          :disabled="disabledBtn"
          autocomplete="new-password"
          >{{ $t('header.login') }}</v-button
        >
      </div>

      <div class="text-center">
        <span class="depp-dark">{{ $t('header.not_have_acc') }}</span>
        <a href="" @click.prevent="openModalSingup">{{
          $t('header.register')
        }}</a>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import Cookies from 'js-cookie';
import IconFooterFb from '~/assets/icons/footer-fb.svg?inline';
import IconGoogle from '~/assets/icons/google-2.svg?inline';
import { EMAIL_NULL_EMPTY, USER_OR_PASS_INCORECT } from '~/utils/errors';
import { validatePassword } from '~/utils/validations';
import { required, email } from 'vuelidate/lib/validators';
import IconEye2 from '~/assets/icons/eye-2.svg?inline';
import IconEye from '~/assets/icons/eye.svg?inline';

export default {
  name: 'FormSignIn',
  components: {
    IconFooterFb,
    IconGoogle,
    IconEye,
    IconEye2
  },

  props: {
    errorMsg: String
  },

  data() {
    return {
      keeplogin: true,
      errorEmail: false,
      errorPassword: false,
      email: '',
      password: '',
      remember: 1,
      messageErrorPass: '',
      messageErrorEmail: '',
      messageErrorSocial: '',
      typePassword: true
    };
  },

  validations() {
    return {
      password: {
        required
      },
      email: {
        required,
        email
      }
    };
  },

  computed: {
    ...mapState('common/eventBus', ['errorMsgOnModalAuth']),
    ...mapGetters('common/common', ['defaultLangCode']),

    fbLoginUrl() {
      return `https://www.facebook.com/dialog/oauth?client_id=${process.env.FB_CLIENT_ID}&scope=email&redirect_uri=${process.env.FB_REDIRECT_URI}`;
    },
    ggLoginUrl() {
      return `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?scope=email%20profile&redirect_uri=${process.env.GG_REDIRECT_URI}&response_type=code&client_id=${process.env.GG_CLIENT_ID}&approval_prompt=force&flowName=GeneralOAuthFlow`;
    },
    disabledBtn() {
      return (
        this.$v.$invalid ||
        this.messageErrorPass !== '' ||
        this.messageErrorEmail !== ''
      );
    }
  },

  methods: {
    ...mapActions('auth/auth', [
      'postUserLogin',
      'postUserUpdateFirebaseToken'
    ]),
    ...mapMutations('common/eventBus', [
      'setModalSignin',
      'setModalSignup',
      'setModalForget',
      'setModalAuth',
      'setErrorMsgOnModalAuth'
    ]),
    ...mapActions('common/user', ['getUserInfo']),
    handleEmail(val) {
      this.email = val.toLowerCase();

      if (!this.$v.email.required) {
        this.errorEmail = true;
        this.messageErrorEmail = this.$t('header.field_require');
      } else if (!this.$v.email.email) {
        this.errorEmail = true;
        this.messageErrorEmail = this.$t('header.invalid_email');
      } else {
        this.errorEmail = false;
        this.messageErrorEmail = '';
      }
    },

    handlePassword(value) {
      if (!validatePassword(value)) {
        this.messageErrorPass = this.$t('header.err_pass');
        this.errorPassword = true;
      } else {
        this.messageErrorPass = '';
        this.errorPassword = false;
      }
    },

    openModalSingup() {
      this.setModalSignup(true);
      this.setModalSignin(false);
    },

    openModalForgot() {
      this.setModalForget(true);
      this.setModalSignin(false);
    },

    async handleLogin() {
      const payload = {
        email: this.email,
        password: this.password,
        remember: this.remember
      };
      this.setErrorMsgOnModalAuth(null);
      const result = await this.postUserLogin(payload);

      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
        // this.showMessageErrorSignIn(result);
      } else {
        localStorage.setItem('history_search', JSON.stringify([]));
        this.setModalAuth(false);
        this.$toasted.info(this.$t('header.login_success'));
        this.getUserInfo().then((response) => {
          Cookies.set('avatar', response.data.avatar);
        });

        // update firebase token
        this.updateFirebaseToken();
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
        .catch((err) => {});
    },

    checkErrorInput() {
      if (this.payload.email === '') {
        this.errorEmail = true;
      }
      if (this.payload.password === '') {
        this.errorPassword = true;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>
