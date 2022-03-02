import * as favoriteActionTypes from '~/utils/action-type/favorite';
import * as favoriteMutationTypes from '~/utils/mutation-type/favorite';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

import {get} from 'lodash';

/**
 * initial state
 */
const state = () => ({
  favorite_list: []
});

/**
 * initial getters
 */
const getters = {
  favoriteList(state) {
    return get(state, "favorite_list.data", []);
  },
  favoritePagination(state) {
    return get(state, "favorite_list.pageable", {});
  },
};

/**
 * initial actions
 */
const actions = {
  /**
   * Get Banner
   */
  async [favoriteActionTypes.GET_FAVORITE_LIST]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.FAVORITE_LIST}`, {
        params: payload
      });
      

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(favoriteMutationTypes.SET_FAVORITE_LIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}favorite/add
   */
  async [favoriteActionTypes.POST_FAVORITE_ADD]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.FAVORITE_ADD}`, payload);
      return result || {};
    } catch (err) {
      return err;
    }
  },
  
  /**
   *   {base_url}favorite/remove
   */
  async [favoriteActionTypes.POST_FAVORITE_REMOVE]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.FAVORITE_REMOVE}`, payload);
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}favorite/add & remove
   */
  async [favoriteActionTypes.POST_FAVORITE]({ commit }, payload) {
    try {
      let result;
      if (payload.isFavorite) {
        result = await this.$axios.post(`${APIs.FAVORITE_REMOVE}`, payload);
      } else {
        result = await this.$axios.post(`${APIs.FAVORITE_ADD}`, payload);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },
};


/**
 * initial mutations
 */
const mutations = {
  [favoriteMutationTypes.SET_FAVORITE_LIST](state, _data) {
    state.favorite_list = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
