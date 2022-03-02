import * as commonMutationTypes from '~/utils/mutation-type/common';

/**
 * initial state
 */
const state = () => ({
  isShowModalSignin: null,
  isShowModalSignup: null,
  isShowModalSignupOtp: null,
  isShowModalForgot: null,
  isShowModalInfo: {},
  avatar: '',
  checkChangeImage: true,
  isShowModalForgetOtp: null,
  isShowModalInputNewPass: null,
  isShowModalSearch: null,
  isShowModalAuth: null,
  errorMsgOnModalAuth: null,
  isShowModalAccountDelete: null,
  isShowMenuMobile: false
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {};

/**
 * initial mutations
 */
const mutations = {
  [commonMutationTypes.SET_MODAL_SIGNIN](state, _data) {
    state.errorMsgOnModalAuth = null;
    state.isShowModalSignin = _data;
  },
  [commonMutationTypes.SET_MODAL_SIGNUP](state, _data) {
    state.isShowModalSignup = _data;
  },
  [commonMutationTypes.SET_MODAL_SIGNUP_OTP](state, _data) {
    state.isShowModalSignupOtp = _data;
  },
  [commonMutationTypes.SET_MODAL_FORGOT](state, _data) {
    state.isShowModalForgot = _data;
  },
  [commonMutationTypes.SET_MODAL_INFO](state, _data) {
    state.isShowModalInfo = _data;
  },
  [commonMutationTypes.SET_MODAL_CHANGE_IMAGE](state, _data) {
    state.checkChangeImage = _data;
  },
  [commonMutationTypes.SET_AVATAR](state, _data) {
    state.avatar = _data;
  },
  [commonMutationTypes.SET_MODAL_FORGOT_OTP](state, _data) {
    state.isShowModalForgetOtp = _data;
  },
  [commonMutationTypes.SET_MODAL_iNPUT_NEW_PASS](state, _data) {
    state.isShowModalInputNewPass = _data;
  },
  [commonMutationTypes.SET_MODAL_SEARCH](state, _data) {
    state.isShowModalSearch = _data;
  },
  [commonMutationTypes.SET_MODAL_AUTH](state, _data) {
    state.isShowModalAuth = _data;
  },
  [commonMutationTypes.SET_ERROR_MSG_ON_MODAL_AUTH](state, _data) {
    state.errorMsgOnModalAuth = _data;
  },
  [commonMutationTypes.SET_MODAL_ACCOUNT_DELETE](state, _data) {
    state.isShowModalAccountDelete = _data;
  },
  [commonMutationTypes.SET_MENU_MOBILE_SHOW](state, _data) {
    state.isShowMenuMobile = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
