<template>
<div>
  <v-modal
    :width="360"
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    @ok="openModalSignin"
  >
    <div>
      <p>
        {{$t("booking.email_has_register")}}
      </p>
    </div>
  </v-modal>
</div>

</template>

<script>
import ModalAuth from '~/components/modals/ModalAuth';
import FormSignIn from '~/components/forms/FormSignIn';
import { mapMutations } from 'vuex'
export default {
  components: {
    ModalAuth,
    FormSignIn
  },

  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    visible: Boolean
  },

  data () {
    return {
      openLogin: false,
      modalAuth: false,
      modalSearch: false,
      modalSignIn: true,
      modalSignUp: false,
      modalSignUpOtp: false,
      modalForgot: false,
      modalForgotOtp: false,
      modalInputNewPass: false,
      popupShowNoti: false,
    }
  },

  methods: {
    ...mapMutations('common/eventBus', [
      'setModalSignin',
      'setModalSignup',
      'setModalForget',
      'setModalInputNewPass',
      'setModalForgetOtp',
      'setModalSignupOtp',
      'setModalSearch',
      'setModalAuth',
      'setErrorMsgOnModalAuth'
    ]),
    openModalSignin() {
      this.setModalSignin(true);
      this.setModalAuth(true);
      this.$emit('cancel')
    }
  }
};
</script>

<style lang="scss">
</style>
