<template>
  <div class="form-auth">
    <h1 class="form-auth__heading">{{$t("account.make_pass")}}</h1>

    <div class="form-auth__item">
      <label class="form-auth__label" for="new-password"
        >{{$t("account.make_pass")}}</label
      >
      <v-input
        type="password"
        class="form-auth__input"
        id="new-password"
        size="lg"
        :placeholder="$t('account.input_pass')"
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
      <div class="d-flex justify-content-end">
        <v-button
          type="submit"
          class="w-100 btn-left"
          rounded
          @click.prevent="$emit('cancel')"
          >{{ $t('hotel.back') }}</v-button
        >
        <v-button
          type="submit"
          variant="primary"
          class="w-100 btn-right"
          rounded
          :disabled="disableBtn"
          @click="handleSubmit"
          >{{ $t('restaurant.confirm') }}</v-button
        >
      </div>
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
    disableBtn() {
      return this.$v.$invalid || this.errorNewPassword || this.errorReNewPassword;
    }
  },
  methods: {
    ...mapActions('common/user', ['postUserCreatePassword']),
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
      const result = await this.postUserCreatePassword({
        password: this.newPassword,
      });

      if (result.code != RES_STATUS_SUCCESS) {
        this.$toasted.error(result.message);
      } else {
          this.$toasted.info(this.$t('account.make_pass_success'));
          this.$emit('success');
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/forms/_form-auth.scss';
</style>
