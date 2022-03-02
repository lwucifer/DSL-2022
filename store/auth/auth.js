import * as authActionTypes from '~/utils/action-type/auth';
import { removeToken, setAccessToken, setToken } from '~/utils/auth';
import * as configs from '~/utils/configs';
import * as APIs from '~/utils/endpoints';
import * as authMutationTypes from '~/utils/mutation-type/auth';
import { get } from 'lodash';

/**
 * initial state
 */
const state = () => ({
  userInfo: null,
  access_token: null,
  registerPayload: null,
  forgetPayload: null,
  sessionIdForgot: null
});

/**
 * initial getters
 */
const getters = {
  isAuthenticated(state, getters, rootState) {
    return !!state.access_token;
  },
  userInfo(state) {
    return state.userInfo;
  },
  accessToken(state) {
    return state.access_token;
  },
  userName(state) {
    return get(state, 'userInfo.name', '');
  },
};

/**
 * initial actions
 */
const actions = {
  /**
   *  {base_url}user/login
   */
  async [authActionTypes.POST_USER_LOGIN]({ commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.AUTH_USER_LOGIN, payload);

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(authMutationTypes.SET_TOKEN, result.data.user_data);
        commit(authMutationTypes.SET_ACCESS_TOKEN, result.data.token);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/logout
   */
  async [authActionTypes.POST_USER_LOGOUT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(APIs.AUTH_USER_LOGOUT, payload);

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(authMutationTypes.REMOVE_TOKEN);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/register
   */
  async [authActionTypes.POST_USER_REGISTER]({ commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.AUTH_USER_REGISTER, payload);
      commit(authMutationTypes.SET_REGISTER_PAYLOAD, payload);
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/sso/google
   */
  async [authActionTypes.POST_USER_LOGIN_SSO_GG]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.AUTH_USER_SSO_GOOGLE}?code=${payload.code}`
      );
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(authMutationTypes.SET_TOKEN, result.data.user_data);
        commit(authMutationTypes.SET_ACCESS_TOKEN, result.data.token);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/sso/facebook
   */
  async [authActionTypes.POST_USER_LOGIN_SSO_FB]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.AUTH_USER_SSO_FACEBOOK}?code=${payload.code}`
      );
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(authMutationTypes.SET_TOKEN, result.data.user_data);
        commit(authMutationTypes.SET_ACCESS_TOKEN, result.data.token);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/register/otp/verify
   */
  async [authActionTypes.POST_USER_REGISTER_OTP_VERIFY]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_REGISTER_OTP_VERIFY,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/forget_password/otp/verify
   */
  async [authActionTypes.POST_USER_FORGET_PW_OTP_VERIFY]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_FORGET_PASSWORD_OTP_VERIFY,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/register/otp/resend
   */
  async [authActionTypes.POST_USER_REGISTER_OTP_RESEND]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_REGISTER_OTP_RESEND,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/forget_password
   */
  async [authActionTypes.POST_USER_FORGET_PW]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_FORGET_PASSWORD,
        payload
      );
      commit(authMutationTypes.SET_FORGET_PAYLOAD, payload);
      if (result.data) {
        commit(authMutationTypes.SET_SESSION_ID_FORGOT, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/forget_password/otp/resend
   */
  async [authActionTypes.POST_USER_FORGET_PW_OTP_RESEND]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_FORGET_PASSWORD_OTP_RESEND,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/forget_password/change_password
   */
  async [authActionTypes.POST_USER_FORGET_PW_CHANGE_PW]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_FORGET_PASSWORD_CHANGE_PASSWORD,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/update/name
   */
  // async [authActionTypes.POST_USER_UPDATE_NAME]({ commit }, payload) {
  //   try {
  //     const result = await this.$axios.post(
  //       APIs.AUTH_USER_UPDATE_NAME,
  //       payload
  //     );
  //     return result;
  //   } catch (err) {
  //     return err;
  //   }
  // },

  /**
   *  {base_url}user/update/avatar
   */
  // async [authActionTypes.POST_USER_UPDATE_AVATAR]({ commit }, payload) {
  //   try {
  //     const result = await this.$axios.post(
  //       APIs.AUTH_USER_UPDATE_AVATAR,
  //       payload
  //     );
  //     return result;
  //   } catch (err) {
  //     return err;
  //   }
  // },

  /**
   *  {base_url}user/update/phone
   */
  // async [authActionTypes.POST_USER_UPDATE_PHONE]({ commit }, payload) {
  //   try {
  //     const result = await this.$axios.post(
  //       APIs.AUTH_USER_UPDATE_PHONE,
  //       payload
  //     );
  //     return result;
  //   } catch (err) {
  //     return err;
  //   }
  // },

  /**
   *  {base_url}user/update/password
   */
  async [authActionTypes.POST_USER_UPDATE_PW]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_UPDATE_PASSWORD,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/superadmin/login
   */
  async [authActionTypes.POST_USER_SUPERADMIN_LOGIN]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_SUPERADMIN_LOGIN,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/update/firebase_token
   */
  async [authActionTypes.POST_USER_UPDATE_FIREBASE_TOKEN]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        APIs.AUTH_USER_UPDATE_FIREBASE_TOKEN,
        payload
      );
      return result;
    } catch (err) {
      return err;
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [authMutationTypes.SET_TOKEN](state, token) {
    state.userInfo = token;
    setToken(token);
  },

  [authMutationTypes.SET_ACCESS_TOKEN](state, access_token) {
    state.access_token = access_token;
    setAccessToken(access_token);
  },

  [authMutationTypes.REMOVE_TOKEN](state) {
    state.userInfo = null;
    state.access_token = null;
    removeToken();
  },
  [authMutationTypes.SET_REGISTER_PAYLOAD](state, _data) {
    state.registerPayload = _data;
  },
  [authMutationTypes.SET_FORGET_PAYLOAD](state, _data) {
    state.forgetPayload = _data;
  },
  [authMutationTypes.SET_SESSION_ID_FORGOT](state, _data) {
    state.sessionIdForgot = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
