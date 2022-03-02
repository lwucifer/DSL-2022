import * as transactionActionTypes from '~/utils/action-type/compare';
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
 * danh sách so sánh
 */
const actions = {
  async [transactionActionTypes.GET_COMPARE_LIST]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMPARE_LIST}`, {
        params: payload
      });
      return result;
    } catch (err) {
      return err;
    }
  },
  /**
   * xóa danh sách so sánh
   *
   */
  async [transactionActionTypes.POST_COMPARE_REMOVE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMPARE_REMOVE}`, {
        params: payload
      });
      return result;
    } catch (err) {
      return err;
    }
  }
};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
