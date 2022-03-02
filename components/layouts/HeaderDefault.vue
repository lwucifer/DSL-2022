<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="header-btn-menu-wrapper d-xl-none">
          <button
            class="header-btn-menu"
            @click.prevent="setMenuMobileShow(true)"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <n-link class="header-logo" :to="`/${defaultLangCode}`">
          <Logo />
          <!-- <img
            src="~assets/images/logo-183x50.png"
            srcset="
              ~assets/images/logo-183x50.png  1x,
              ~assets/images/logo-366x101.png 2x
            "
            alt=""
          /> -->
        </n-link>

        <MegaMenu class="d-none d-xl-block" />

        <div class="header-content-right">
          <IconSearch
            class="icon mr-2 mr-4 mr-md-5 pointer"
            @click="showModalSearch"
          />

          <HeaderNoti
            v-if="!!$store.getters['auth/auth/isAuthenticated']"
            :popupShowNoti="popupShowNoti"
            @show="showContentNoti"
          />

          <HeaderDefaultAccount
            v-if="!!$store.getters['auth/auth/isAuthenticated']"
          />
          <span v-else class="header-trigger-auth">
            <a href="" @click.prevent="openModalSignin">{{
              $t('header.login')
            }}</a
            >/<a href="" @click.prevent="openModalSignUp">{{
              $t('header.register_2')
            }}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- SEARCH MODAL -->
    <ModalSearch v-model="modalSearch" @cancel="closeModalSearch" />

    <!-- SIGNIN MODAL -->
    <ModalAuth
      v-model="modalAuth"
      :width="600"
      centered
      @cancel="setModalAuth(false)"
    >
      <FormSignIn v-if="modalSignIn" />
      <FormForgetPassword v-if="modalForgot" />
      <FormOTPForgetPassword v-if="modalForgotOtp" />
      <FormInputNewPassword v-if="modalInputNewPass" />
      <FormSignUp v-if="modalSignUp" />
      <FormOTPSignUp v-if="modalSignUpOtp" />
    </ModalAuth>

    <v-modal
      v-model="popupShowNoti"
      :width="600"
      centered
      @cancel="hideContentNoti"
      :footer="false"
      :header="false"
    >
      <PopupShowNoti :data="dataContentNoti" />
    </v-modal>

    <v-modal
      v-model="popupShowNotiAccount"
      :width="600"
      centered
      @cancel="setModalAccountDelete(false)"
      :footer="false"
      :header="false"
    >
      <div class="text-center">
        <h3 class="mb-16 danger">{{ $t('header.logout') }}</h3>
        <p>
          {{ $t('header.err_acc') }}
        </p>
      </div>
    </v-modal>
  </header>
</template>

<script>
import HeaderDefaultAccount from './HeaderDefaultAccount';
import HeaderNoti from './HeaderNoti';
import ModalSearch from '~/components/modals/ModalSearch';
import ModalAuth from '~/components/modals/ModalAuth';
import FormSignIn from '~/components/forms/FormSignIn';
import FormForgetPassword from '~/components/forms/FormForgetPassword';
import FormOTPForgetPassword from '~/components/forms/FormOTPForgetPassword';
import FormInputNewPassword from '~/components/forms/FormInputNewPassword';
import FormSignUp from '~/components/forms/FormSignUp';
import FormOTPSignUp from '~/components/forms/FormOTPSignUp';
import PopupShowNoti from '~/components/pages/common/PopupShowNoti';
import MegaMenu from './MegaMenu';

import IconLogo from '~/assets/icons/metro-logo.svg?inline';
import IconSearch from '~/assets/icons/searching.svg?inline';
import IconLine from '~/assets/icons/vertical-line.svg?inline';
import Logo from '~/assets/images/logo.svg?inline';

import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { get } from 'lodash';

export default {
  components: {
    HeaderDefaultAccount,
    ModalSearch,
    ModalAuth,
    FormSignIn,
    FormForgetPassword,
    FormOTPForgetPassword,
    FormInputNewPassword,
    FormSignUp,
    FormOTPSignUp,
    IconLogo,
    IconSearch,
    IconLine,
    PopupShowNoti,
    MegaMenu,
    Logo
  },

  data() {
    return {
      modalAuth: false,
      modalSearch: false,
      modalSignIn: true,
      modalSignUp: false,
      modalSignUpOtp: false,
      modalForgot: false,
      modalForgotOtp: false,
      modalInputNewPass: false,
      popupShowNoti: false,
      dataContentNoti: [],
      popupShowNotiAccount: false
    };
  },

  computed: {
    ...mapState('common/eventBus', [
      'isShowModalSignin',
      'isShowModalSignup',
      'isShowModalSignupOtp',
      'isShowModalForgot',
      'isShowModalForgetOtp',
      'isShowModalInputNewPass',
      'isShowModalSearch',
      'isShowModalAuth',
      'errorMsgOnModalAuth',
      'isShowModalAccountDelete'
    ]),
    ...mapGetters('common/common', ['defaultLangCode'])
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
      'setErrorMsgOnModalAuth',
      'setModalAccountDelete',
      'setMenuMobileShow'
    ]),

    ...mapActions('common/common', [
      'getSuggestionHotel',
      'getSuggestionRestaurant',
      'getSuggestionTour',
      'getSuggestionTravel'
    ]),

    openModalSignin() {
      this.setModalSignin(true);
      this.setModalAuth(true);
    },
    openModalSignUp() {
      this.setModalSignup(true);
      this.setModalSignin(false);
      this.setModalAuth(true);
      this.modalSignIn = false;
    },

    showContentNoti(data) {
      this.dataContentNoti = data;
      this.popupShowNoti = true;
    },

    hideContentNoti() {
      const timeout = setTimeout(() => {
        this.popupShowNoti = false;
        clearTimeout(timeout);
      });
    },

    showModalSearch() {
      this.$nuxt.refresh()
      this.setModalSearch(!this.modalSearch),
      this.getSuggestionHotel({ page_index: 1, page_size: 4 }),
      this.getSuggestionRestaurant({ page_index: 1, page_size: 4 }),
      this.getSuggestionTour({ page_index: 1, page_size: 4 }),
      this.getSuggestionTravel({ page_index: 1, page_size: 4 })
    },

    closeModalSearch() {
      this.setModalSearch(false)
      this.$nuxt.refresh()
    }
  },

  watch: {
    isShowModalSignin(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalSignIn = _newVal;
      // }
    },

    isShowModalSignup(_newVal, _oldVal) {
      this.modalSignUp = _newVal;
    },

    isShowModalSignupOtp(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalSignUpOtp = _newVal;
      // }
    },

    isShowModalForgot(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalForgot = _newVal;
      // }
    },

    isShowModalForgetOtp(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalForgotOtp = _newVal;
      // }
    },

    isShowModalInputNewPass(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalInputNewPass = _newVal;
      // }
    },

    isShowModalSearch(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.modalSearch = _newVal;
      // }
    },

    isShowModalAccountDelete(_newVal, _oldVal) {
      // if(_newVal === false) {
      this.popupShowNotiAccount = _newVal;
      // }
    },

    isShowModalAuth(_newVal, _oldVal) {
      this.modalAuth = _newVal;
      if (_newVal === false) {
        this.setModalSignin(true);
        this.setModalSignup(null);
        this.setModalForget(null);
        this.setModalInputNewPass(null);
        this.setModalForgetOtp(null);
        this.setModalSignupOtp(null);
      }
    },

    '$route.query': function (_newVal) {
      const { errorLogin, errorLoginMsg } = _newVal;
      if (!!errorLogin) {
        this.openModalSignin();
        this.$toasted.error(this.$t('header.social_interrupted'));
        // this.setErrorMsgOnModalAuth = 'Kết nối tới Mạng xã hội bị gián đoạn. Bạn vui lòng đăng nhập bằng Email hoặc thử lại sau';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/layouts/_header-default.scss';
</style>
