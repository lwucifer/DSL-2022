import * as userActionTypes from '~/utils/action-type/user';
import * as APIs from '~/utils/endpoints';

/**
 * initial state
 */
const state = () => ({});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  /**
   *  {base_url}user/update/name
   */
  async [userActionTypes.POST_USER_UPDATE_NAME]({ commit }, payload) {
    try {
      const data = await this.$axios.post(APIs.AUTH_USER_UPDATE_NAME, payload);
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/update/avatar
   */
  async [userActionTypes.POST_USER_UPDATE_AVATAR]({ commit }, payload) {
    try {
      const data = await this.$axios.post(
        APIs.AUTH_USER_UPDATE_AVATAR,
        payload
      );
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/update/phone
   */
  async [userActionTypes.POST_USER_UPDATE_PHONE]({ commit }, payload) {
    try {
      const data = await this.$axios.post(APIs.AUTH_USER_UPDATE_PHONE, payload);
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}user/update/password
   */
  async [userActionTypes.POST_USER_UPDATE_PW]({ commit }, payload) {
    try {
      const data = await this.$axios.post(
        APIs.AUTH_USER_UPDATE_PASSWORD,
        payload
      );
      return data;
    } catch (err) {
      return err;
    }
  }
};

/**
 * initial mutations
 */
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
