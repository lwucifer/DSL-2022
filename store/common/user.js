import * as commonActionTypes from '~/utils/action-type/common';
import * as commonMutationTypes from '~/utils/mutation-type/common';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

import {get} from 'lodash';

/**
 * initial state
 */
const state = () => ({
  user_info: {},
  notification_list_new: {},
  notification_list_new_data: {},
  notification_new_amount: {},
  notification_detail: {},
  notification_list: [],
  newsletter: {},
  check_newsletter: {}
});

/**
 * initial getters
 */
const getters = {
  getDataNotiList(state) {
    return get(state, 'notification_list.data', []);
  },

  getPageableNotiList(state) {
    return get(state, 'notification_list.pageable', []);
  },

  userPasswordStatus(state){
    return get(state, 'user_info.password_status', 0);
  },
};

/**
 * initial actions
 */
const actions = {
  /**
   * {base_url}user/notification/list/new
   */
  async [commonActionTypes.GET_USER_INFO]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_USER_INFO}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_USER_INFO, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/notification/list/new
   */
  async [commonActionTypes.GET_USER_NOTIFICATION_LIST_NEW](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_USER_NOTIFICATION_LIST_NEW}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_USER_NOTIFICATION_LIST_NEW, result.data);
      }
      return result.data;
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_USER_NOTIFICATION_LIST_DATA](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_USER_NOTIFICATION_LIST}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_USER_NOTIFICATION_LIST_NEW_DATA, result.data.data);
      }
      return result.data.data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/notification/list/new
   */
  async [commonActionTypes.GET_USER_NOTIFICATION_NEW_AMOUNT](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_USER_NOTIFICATION_NEW_AMOUNT}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          commonMutationTypes.SET_USER_NOTIFICATION_NEW_AMOUNT,
          result.data
        );
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/notification/detail?notification_id=1
   */
  async [commonActionTypes.GET_USER_NOTIFICATION_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_USER_NOTIFICATION_DETAIL}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_USER_NOTIFICATION_DETAIL, result.data);
      }
      return result.data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/notification/list
   */
  async [commonActionTypes.GET_USER_NOTIFICATION_LIST](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_USER_NOTIFICATION_LIST}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_USER_NOTIFICATION_LIST, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/notification/news_letter
   */
  async [commonActionTypes.GET_NEWSLETTER](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_NEWSLETTER}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_NEWSLETTER, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.POST_USER_CREATE_PASSWORD]({ commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.COMMON_USER_CREATE_PASSWORD, payload);
      return result;
    } catch (err) {
      return err;
    }
  },


  /**
   * {base_url}user/check_register_news_letter
   */
  async [commonActionTypes.GET_CHECK_NEWSLETTER](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_CHECK_NEWSLETTER}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_CHECK_NEWSLETTER, result.data);
      }
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
  [commonMutationTypes.SET_USER_INFO](state, _data) {
    state.user_info = _data;
  },
  [commonMutationTypes.SET_USER_NOTIFICATION_LIST_NEW](state, _data) {
    state.notification_list_new = _data;
  },

  [commonMutationTypes.SET_USER_NOTIFICATION_LIST_NEW_DATA](state, _data) {
    state.notification_list_new_data = _data;
  },
  
  [commonMutationTypes.SET_USER_NOTIFICATION_NEW_AMOUNT](state, _data) {
    state.notification_new_amount = _data;
  },
  [commonMutationTypes.SET_USER_NOTIFICATION_DETAIL](state, _data) {
    state.notification_detail = _data;
  },
  [commonMutationTypes.SET_USER_NOTIFICATION_LIST](state, _data) {
    state.notification_list = _data;
  },
  [commonMutationTypes.SET_NEWSLETTER](state, _data) {
    state.newsletter = _data;
  },
  [commonMutationTypes.SET_CHECK_NEWSLETTER](state, _data) {
    state.check_newsletter = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
