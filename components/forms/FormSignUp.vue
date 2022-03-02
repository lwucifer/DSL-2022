<template>
  <div class="form-auth">
    <h1 class="form-auth__heading">{{$t('header.register_3')}}</h1>

    <div class="form-auth__item">
      <label class="form-auth__label" for="fullname">
        {{$t("header.full_name")}}
        <span class="danger">*</span>
      </label>
      <v-input
        class="form-auth__input"
        id="fullname"
        size="lg"
        :placeholder="$t('header.input_fullname')"
        name="fullname"
        rounded
        v-model="fullname"
        :valid="errorFullname ? false : null"
        @input="handleFullname"
      />
      <span class="danger caption" v-if="messageErrorFullname">{{
        messageErrorFullname
      }}</span>
    </div>

    <div class="form-auth__item">
      <label class="form-auth__label" for="email">
        {{$t("header.email")}}
         <span class="danger">*</span>
      </label>
      <v-input
        class="form-auth__input"
        id="email"
        size="lg"
        :placeholder="$t('header.input_email')"
        name="email"
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
      <label class="form-auth__label" for="password">
        {{$t("header.password")}}
         <span class="danger">*</span>
      </label>
      <v-input
        class="form-auth__input"
        id="password"
        :type="typePassword ? 'password' : 'text'"
        size="lg"
        :placeholder="$t('header.password') + '*'"
        name="password"
        rounded
        v-model="password"
        autocomplete="new-password"
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
      <!-- @input="handlePassword" -->
      <!-- <span class="text-error">{{ messageErrorPass }}</span> -->
      <span class="danger caption" v-if="messageErrorPass">{{
        messageErrorPass
      }}</span>
    </div>

    <div class="form-auth__item form-auth__item--action">
      <v-button
        type="button"
        size="lg"
        variant="primary"
        class="w-100"
        rounded
        :disabled="disabledBtn"
        @click="handleRegister"
        >{{$t("header.register")}}</v-button
      >
    </div>

    <div class="text-center">
      <span class="depp-dark">{{$t("header.have_acc")}}</span>
      <a href="" @click.prevent="openModalSingin">{{$t("header.login")}}</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import { EMAIL_EXIST, SYSTEM_ERROR } from '~/utils/errors';
import { validatePassword } from '~/utils/validations';
import { required, email, maxLength } from 'vuelidate/lib/validators';
import IconEye2 from '~/assets/icons/eye-2.svg?inline';
import IconEye from '~/assets/icons/eye.svg?inline';

export default {
  components: {
    IconEye,
    IconEye2
  },
  data() {
    return {
      fullname: null,
      email: null,
      password: null,
      messageErrorSignUp: '',
      errorFullname: false,
      errorPassword: false,
      errorEmail: false,
      messageErrorFullname: '',
      messageErrorPass: '',
      messageErrorEmail: '',
      typePassword: true
    };
  },

  validations() {
    return {
      fullname: {
        required,
        maxLength: maxLength(251)
      },
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
    disabledBtn() {
      return (
        this.$v.$invalid ||
        this.messageErrorPass !== '' ||
        this.messageErrorEmail !== ''
      );
    }
  },

  methods: {
    ...mapActions('auth/auth', ['postUserRegister']),
    ...mapMutations('common/eventBus', [
      'setModalSignup',
      'setModalSignin',
      'setModalSignupOtp'
    ]),

    handleFullname() {
      // if (this.errorFullname) {
      //   this.errorFullname = false;
      // }
      if (!this.$v.fullname.required) {
        this.errorFullname = true;
        this.messageErrorFullname = this.$t("header.field_require");
      } else if (!this.$v.fullname.maxLength) {
        this.errorFullname = true;
        this.messageErrorFullname = this.$t("header.fullname_not_exceed");
      } else {
        this.errorFullname = false;
        this.messageErrorFullname = '';
      }
    },

    handleEmail(val) {
      this.email = val.toLowerCase()

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

    handlePassword(value) {
      if (!validatePassword(value)) {
        this.messageErrorPass = this.$t("header.err_pass");
        this.errorPassword = true;
      } else {
        this.messageErrorPass = '';
        this.errorPassword = false;
      }
    },

    openModalSingin() {
      this.setModalSignup(false);
      this.setModalSignin(true);
    },

    async handleRegister() {
      const payload = {
        fullname: this.fullname,
        email: this.email,
        password: this.password
      };
      const result = await this.postUserRegister(payload);

      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
      } else {
        this.setModalSignup(false);
        // this.$toasted.info('Signup successfully');
        this.setModalSignupOtp(true);
      }
    }
    // showMessageErrorSignUp(error) {
    //   let message = '';
    //   switch (error.code) {
    //     case EMAIL_EXIST:
    //       message = 'Email đã tồn tại trên hệ thống';
    //       break;
    //     case SYSTEM_ERROR:
    //       message = 'Họ tên không được nhập quá 251 kí tự';
    //       this.errorFullname = true;
    //       break;
    //     case SYSTEM_ERROR:
    //       message = 'Họ tên không được nhập quá 251 kí tự';
    //       this.errorFullname = true;
    //       break;
    //       message = 'Đã có lỗi xin vui lòng thử lại';
    //       break;
    //   }
    //   this.$toasted.error(message);
    // }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>
