import * as homeActionTypes from '~/utils/action-type/home';
import * as homeMutationTypes from '~/utils/mutation-type/home';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

/**
 * initial state
 */
const state = () => ({
  slider: {},
});

/**
 * initial getters
 */
const getters = {};

/**
 * initial actions
 */
const actions = {
  /**
   * Get Home Banner
   */
  async [homeActionTypes.GET_SLIDER_BANNER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_SLIDER_BANNER}`);
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_SLIDER_BANNER, result.data);
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
    [homeMutationTypes.SET_HOME_SLIDER_BANNER](state, _data) {
      state.slider = _data;
    },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
