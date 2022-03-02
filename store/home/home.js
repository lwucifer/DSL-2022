import * as homeActionTypes from '~/utils/action-type/home';
import * as homeMutationTypes from '~/utils/mutation-type/home';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

import {get} from 'lodash';

/**
 * initial state
 */
const state = () => ({
  slider: [],
  combo: {},
  hotel: {},
  partner: {},
  restaurant: {},
  tour: {},
  video: {},
  productCategory: {},
  tourismProductCategory: []
});

/**
 * initial getters
 */
const getters = {
  getProductCategory(state) {
    return get(state, 'productCategory.productCategory', {});
  },
  
  getAroundLocations(state) {
    return get(state, 'productCategory.aroundLocations', {});
  },

  getProductLang(state) {
    return get(state, 'productCategory.productCategoryLang', {});
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   * Get Home Banner
   */
  async [homeActionTypes.GET_SLIDER_BANNER]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_SLIDER_BANNER}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_SLIDER_BANNER, result.data || []);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_COMBO]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_COMBO}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_COMBO, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_HOTEL]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_HOTEL}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_HOTEL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_RESTAURANT]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_RESTAURANT}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_RESTAURANT, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_TOUR]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_TOUR}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_TOUR, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_VIDEO]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_VIDEO}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_VIDEO, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },


  async [homeActionTypes.GET_HOME_PARTNER]({ commit }, params) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_PARTNER}`, {params});
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_PARTNER, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.POST_FAVORITE]({ commit, state }, payload) {
    try {
      const { id, type, isFavorite } = payload;
      const result = await this.$axios.post(
        APIs[isFavorite ? 'FAVORITE_ADD' : 'FAVORITE_REMOVE'],
        {
          id,
          type
        }
      );

      return result;
    } catch (err) {
      return err;
    }
  },


  async [homeActionTypes.GET_HOME_PRODUCT_CATEGORY]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_PRODUCT_CATEGORY}`, { params: payload });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_PRODUCT_CATEGORY, result.data);
      }
      return result || [];
    } catch (err) {
      return err;
    }
  },

  async [homeActionTypes.GET_HOME_TOURISM_PRODUCT_CATEGORY]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_TOURISM_PRODUCT_CATEGORY}`, { params: payload });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(homeMutationTypes.SET_HOME_TOURISM_PRODUCT_CATEGORY, result.data);
      }
      return result || {}
    } catch (err) {
      return err;
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
    [homeMutationTypes.SET_HOME_SLIDER_BANNER](state, _data) {
      state.slider = _data;
    },

    [homeMutationTypes.SET_HOME_COMBO](state, _data) {
      state.combo = _data;
    },

    [homeMutationTypes.SET_HOME_HOTEL](state, _data) {
      state.hotel = _data;
    },

    [homeMutationTypes.SET_HOME_RESTAURANT](state, _data) {
      state.restaurant = _data;
    },

    [homeMutationTypes.SET_HOME_TOUR](state, _data) {
      state.tour = _data;
    },

    [homeMutationTypes.SET_HOME_VIDEO](state, _data) {
      state.video = _data;
    },

    [homeMutationTypes.SET_HOME_PARTNER](state, _data) {
      state.partner = _data;
    },
    
    [homeMutationTypes.SET_HOME_PRODUCT_CATEGORY](state, _data) {
      state.productCategory = _data;
    },

    [homeMutationTypes.SET_HOME_TOURISM_PRODUCT_CATEGORY](state, _data) {
      state.tourismProductCategory = _data;
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
