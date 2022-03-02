import * as commonActionTypes from '~/utils/action-type/common';
import * as configs from '~/utils/configs';
import * as APIs from '~/utils/endpoints';
import * as commonMutationTypes from '~/utils/mutation-type/common';

import { get } from 'lodash';
/**
 * initial state
 */
const state = () => ({
  
  areas: [],
  province: [],
  district: [],
  ward: [],
  ratings: [],
  hotel_types: [],
  restaurant_types: [],
  dish_types: [],
  price_ranges: [],
  tour_start_places: [],
  tour_times: [],
  tour_types: [],
});

/**
 * initial getters
 */
const getters = {
  selectedRangePrice(state) {
    return get(state, 'price_ranges', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },

  selectAreas(state) {
    return get(state, 'areas', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },

  selectProvince(state) {
    return get(state, 'province', []).map((a) => {
      return {
        value: a.id,
        text: a.full_name
      };
    });
  },

  selectDistrict(state) {
    return get(state, 'district', []).map((a) => {
      return {
        value: a.id,
        text: a.full_name
      };
    });
  },

  selectWard(state) {
    return get(state, 'ward', []).map((a) => {
      return {
        value: a.id,
        text: a.full_name
      };
    });
  },

  selectRatings(state) {
    return get(state, 'ratings', []).map((a) => {
      return {
        value: a.value,
        text: a.name
      };
    });
  },
  selectHotelTypes(state) {
    return get(state, 'hotel_types', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  selectDishTypes(state) {
    return get(state, 'dish_types', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  selectRestaurantTypes(state) {
    return get(state, 'restaurant_types', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  selectTourTypes(state) {
    return get(state, 'tour_types', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  selectTourTimes(state) {
    return get(state, 'tour_times', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  
};

/**
 * initial actions
 */
const actions = {
  

  /**
   * {base_url}utilities/area?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_PROVINCE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_AREA}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_PROVINCE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_UTILITIES_DISTRICT]({ commit}, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_DISTRICT}`, { params: payload });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_DISTRICT, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_UTILITIES_WARD]({ commit}, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_WARD}`, { params: payload });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_WARD, result.data);
      }
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/province?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_AREA]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_PROVINCE}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_AREA, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/rating?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_RATING]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_RATING}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_RATING, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/hotel/type?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_HOTEL_TYPE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_HOTEL_TYPE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_HOTEL_TYPE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/dish/type?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_DISH_TYPE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_DISH_TYPE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_DISH_TYPE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/restaurant/type?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_RESTAURANT_TYPE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_RESTAURANT_TYPE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_RESTAURANT_TYPE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/price_range?currency=1
   */
  async [commonActionTypes.GET_UTILITIES_PRICE_RANGE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_PRICE_RANGE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_PRICE_RANGE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/tour/start_place?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_TOUR_START_PLACE](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_TOUR_START_PLACE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_TOUR_START_PLACE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/tour/time?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_TOUR_TIME]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_TOUR_TIME}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_TOUR_TIME, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/tour/type?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_TOUR_TYPE]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_TOUR_TYPE}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_TOUR_TYPE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  
  [commonMutationTypes.SET_UTILITIES_AREA](state, _data) {
    state.areas = _data;
  },
  [commonMutationTypes.SET_UTILITIES_PROVINCE](state, _data) {
    state.province = _data;
  },
  [commonMutationTypes.SET_UTILITIES_DISTRICT](state, _data) {
    state.district = _data;
  },
  [commonMutationTypes.SET_UTILITIES_WARD](state, _data) {
    state.ward = _data;
  },
  [commonMutationTypes.SET_UTILITIES_RATING](state, _data) {
    state.ratings = _data;
  },
  [commonMutationTypes.SET_UTILITIES_HOTEL_TYPE](state, _data) {
    state.hotel_types = _data;
  },
  [commonMutationTypes.SET_UTILITIES_DISH_TYPE](state, _data) {
    state.dish_types = _data;
  },
  [commonMutationTypes.SET_UTILITIES_RESTAURANT_TYPE](state, _data) {
    state.restaurant_types = _data;
  },
  [commonMutationTypes.SET_UTILITIES_PRICE_RANGE](state, _data) {
    state.price_ranges = _data;
  },
  [commonMutationTypes.SET_UTILITIES_TOUR_START_PLACE](state, _data) {
    state.tour_start_places = _data;
  },
  [commonMutationTypes.SET_UTILITIES_TOUR_TIME](state, _data) {
    state.tour_times = _data;
  },
  [commonMutationTypes.SET_UTILITIES_TOUR_TYPE](state, _data) {
    state.tour_types = _data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
