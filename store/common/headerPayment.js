import * as commonMutationTypes from '~/utils/mutation-type/common';

/**
 * initial state
 */
const state = () => ({
  steps: []
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
  [commonMutationTypes.SET_HEADER_PAYMENT_STEPS](state, _data) {
    state.steps = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
