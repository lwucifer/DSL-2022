import { get } from 'lodash';

import * as bookingActionTypes from '~/utils/action-type/booking';
import * as bookingMutationTypes from '~/utils/mutation-type/booking';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

/**
 * initial state
 */
const state = () => ({
  transaction: []
});

/**
 * initial getters
 */
const getters = {
  hotelTransaction(state) {
    return {
      account_type: 0,
      start_date: get(state.transaction.hotel, 'check_in', ''),
      end_date: get(state.transaction.hotel, 'check_out', ''),
      name: get(state.transaction.hotelInfo, 'name', ''),
      check_in_hour: get(state.transaction.hotelInfo, 'checkin_hour', ''),
      check_out_hour: get(state.transaction.hotelInfo, 'checkout_hour', ''),
      currency_code: get(state.transaction.master, 'currency_code', ''),
      customer_email: get(state.transaction.master, 'cust_email', ''),
      order_id: get(state.transaction.master, 'order_id_mask', ''),
      payment_status: get(state.transaction.master, 'payment_status', ''),
      price: get(state.transaction.master, 'total_amount', '')
    }
  },

  productTravelTransaction(state) {
    return {
      account_type: 0,
      name: get(state.transaction.productInfo, 'productName', ''),
      quantity: get(state.transaction.product, 'quantity', ''),
      currency_code: get(state.transaction.master, 'currency_code', ''),
      customer_email: get(state.transaction.master, 'cust_email', ''),
      order_id: get(state.transaction.master, 'order_id_mask', ''),
      payment_status: get(state.transaction.master, 'payment_status', ''),
      price: get(state.transaction.master, 'total_amount', '')
    }
  },

  tourTransaction(state) {
    return {
      account_type: 0,
      number_day: get(state.transaction.tourInfo, 'number_day', ''),
      number_night: get(state.transaction.tourInfo, 'number_night', ''),
      name: get(state.transaction.tourInfo, 'name', ''),
      start_place: get(state.transaction.tourInfo, 'start_place_name', ''),
      start_date: get(state.transaction.tour, 'departureDate', ''),
      currency_code: get(state.transaction.master, 'currency_code', ''),
      customer_email: get(state.transaction.master, 'cust_email', ''),
      order_id: get(state.transaction.master, 'order_id_mask', ''),
      payment_status: get(state.transaction.master, 'payment_status', ''),
      price: get(state.transaction.master, 'total_amount', '')
    }
  }
};

/**
 * initial actions
 */
const actions = {
  async [bookingActionTypes.POST_BOOKING_TOUR]({ state, commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.TOUR_BOOKING, payload);

      // if (result.code == configs.RES_STATUS_SUCCESS) {
      // }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [bookingActionTypes.POST_BOOKING_RESTAURANT]({ state, commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.RESTAURANT_BOOKING, payload);

      // if (result.code == configs.RES_STATUS_SUCCESS) {
      // }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [bookingActionTypes.POST_BOOKING_HOTEL]({ state, commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.HOTEL_BOOKING, payload);

      // if (result.code == configs.RES_STATUS_SUCCESS) {
      // }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [bookingActionTypes.POST_BOOKING_PRODUCT]({ state, commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.PRODUCT_TRAVEL_BOOKING, payload);

      // if (result.code == configs.RES_STATUS_SUCCESS) {
      // }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [bookingActionTypes.CREATE_PAY_URL]({ state, commit }, payload) {
    try {
      const result = await this.$axios.post(APIs.PAYMENT_URL, payload);

      // if (result.code == configs.RES_STATUS_SUCCESS) {
      // }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [bookingActionTypes.GET_TRANSACTION_DETAIL]({ state, commit }, params) {
    try {
      const result = await this.$axios.get(APIs.GET_TRANSACTION_DETAIL, { params });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(bookingMutationTypes.SET_INFORMATION_BOOKING, result.data);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  }
};

/**
 * initial mutations
 */
const mutations = {
  [bookingMutationTypes.SET_INFORMATION_BOOKING](state, _data) {
    state.transaction = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
