import * as aroundLocationActionTypes from '~/utils/action-type/aroundLocation';
import * as aroundLocationMutationTypes from '~/utils/mutation-type/aroundLocation';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

import {get} from 'lodash';

/**
 * initial state
 */
const state = () => ({
  aroundLocationHotel: [],
  aroundLocationProduct: [],
  aroundLocationRestaurant: [],
  mapLoading: false
});

/**
 * initial getters
 */
const getters = {
  aroundLocationHotel(state) {
    return get(state, "aroundLocationHotel.data", []);
  },

  aroundLocationRestaurant(state) {
    return get(state, "aroundLocationRestaurant.data", []);
  },
  
  aroundLocationProduct(state) {
    return get(state, "aroundLocationProduct.data", []);
  },
  mapLoading(state) {
    return state.mapLoading;
  },
};

/**
 * initial actions
 */
const actions = {
  /**
   * Get around location hotel
   */
  async [aroundLocationActionTypes.GET_AROUND_LOCATION_HOTEL]({ commit }, payload) {
    try {
	  commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_HOTEL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_HOTEL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, false);
    }
  },
  
  /**
   * Get around location restaurant
   */
  async [aroundLocationActionTypes.GET_AROUND_LOCATION_RESTAURANT]({ commit }, payload) {
    try {
	  commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_RESTAURANT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_RESTAURANT, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }finally {
      commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, false);
    }
  },
  
  /**
   * Get around location product
   */
  async [aroundLocationActionTypes.GET_AROUND_LOCATION_PRODUCT]({ commit }, payload) {
    try {
	  commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_PRODUCT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_RESTAURANT, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }finally {
      commit(aroundLocationMutationTypes.SET_MAP_IS_FETCHING, false);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_RESTAURANT](state, _data) {
    state.aroundLocationRestaurant = _data;
  },
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_HOTEL](state, _data) {
    state.aroundLocationHotel = _data;
  },
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_PRODUCT](state, _data) {
    state.aroundLocationProduct = _data;
  },
  [aroundLocationMutationTypes.SET_MAP_IS_FETCHING](state, _data) {
    state.mapLoading = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
