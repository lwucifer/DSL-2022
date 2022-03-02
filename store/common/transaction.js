import * as transactionActionTypes from '~/utils/action-type/transaction';
import * as configs from '~/utils/configs';
import * as APIs from '~/utils/endpoints';
import * as transactionMutationType from '~/utils/mutation-type/common';
import * as transactionMutationTypes from '~/utils/mutation-type/transaction';

/**
 * initial state
 */
const state = () => ({
  // transactionPriceTour: null,
  transactionPriceHotel: null
  // transactionHotel: null,
  // transactionHotelTour: null,
  // transactionHotelRestaurant: null
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
   * {{url}}transaction/calculate_price_hotel
   */
  async [transactionActionTypes.GET_TRANSACTION_CALCULATE_PRICE_HOTEL](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.TRANSACTION_CALCULATE_PRICE_HOTEL}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          transactionMutationTypes.SET_TRANSACTION_CALCULATE_PRICE_HOTEL,
          result.data
        );
      }
      return result;
    } catch (err) {
      return err;
    }
  },
  // {{url}}transaction/hotel
  // async [transactionActionTypes.GET_TRANSACTION_CALCULATE_HOTEL](
  //   { commit },
  //   payload
  // ) {
  //   try {
  //     const result = await this.$axios.get(`${APIs.HOTEL_TRANSACTION}`, {
  //       params: payload
  //     });

  //     if (result.code == configs.RES_STATUS_SUCCESS) {
  //     }
  //     return result;
  //   } catch (err) {
  //     return err;
  //   }
  // },
  async [transactionActionTypes.GET_TRANSACTION_HOTEL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_TRANSACTION}`, {
        params: payload
      });
      // if (result.code == configs.RES_STATUS_SUCCESS) {
      //   commit(transactionMutationType.SET_TRANSACTION_HOTEL, result.data);
      // }

      return result;
    } catch (err) {
      return err;
    }
  },
  // {{url}}transaction/tour
  async [transactionActionTypes.GET_TRANSACTION_TOUR]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_TRANSACTION}`, {
        params: payload
      });
      // if (result.code == configs.RES_STATUS_SUCCESS) {
      //   commit(transactionMutationType.SET_TRANSACTION_TOUR, result.data);
      // }
      return result;
    } catch (err) {
      return err;
    }
  },
  // {{url}}transaction/restaurant
  async [transactionActionTypes.GET_TRANSACTION_RESTAURANT](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(`${APIs.RESTAURANT_TRANSACTION}`, {
        params: payload
      });
      // if (result.code == configs.RES_STATUS_SUCCESS) {
      //   commit(transactionMutationType.SET_TRANSACTION_RESTAURANT, result.data);
      // }
      return result;
    } catch (err) {
      return err;
    }
  },
  // /////////
  async [transactionActionTypes.GET_TRANSACTION_PRODUCTS]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.PRODUCTS_TRANSACTION}`, {
        params: payload
      });
      return result;
    } catch (err) {
      return err;
    }
  },
  ///////////
  // transaction/cancel
  async [transactionActionTypes.POST_CANCEL_TRANSACTION]({ commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.CANCEL_TRANSACTION, payload);
      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {{url}}transaction/calculate_price_tour
   */
  async [transactionActionTypes.GET_TRANSACTION_CALCULATE_PRICE_TOUR](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.TRANSACTION_CALCULATE_PRICE_TOUR}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        // commit(
        //   transactionMutationTypes.SET_TRANSACTION_CALCULATE_PRICE_TOUR,
        //   result.data
        // );
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
  //
  // [transactionMutationType.SET_TRANSACTION_HOTEL](state, _data) {
  //   state.transactionHotel = _data;
  // },
  // [transactionMutationType.SET_TRANSACTION_TOUR](state, _data) {
  //   state.transactionHotelTour = _data;
  // },
  // [transactionMutationType.SET_TRANSACTION_RESTAURANT](state, _data) {
  //   state.transactionHotelRestaurant = _data;
  // },

  [transactionMutationTypes.SET_TRANSACTION_CALCULATE_PRICE_HOTEL](
    state,
    _data
  ) {
    state.transactionPriceHotel = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
