import * as restaurantActionTypes from '~/utils/action-type/restaurant';
import * as restaurantMutationTypes from '~/utils/mutation-type/restaurant';
import * as aroundLocationActionTypes from '~/utils/action-type/aroundLocation';
import * as aroundLocationMutationTypes from '~/utils/mutation-type/aroundLocation';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';
import {PAGER} from '~/utils/constants';

import { get, map, isArray } from 'lodash';

/**
 * initial state
 */
const state = () => ({
  restaurant_list: [],
  restaurant_detail: {},
  restaurant_comments: {
    data: [],
    pageable: {}
  },
  restaurant_related: [],
  isFetchingList: false,
});

/**
 * initial getters
 */
const getters = {
  restaurantList(state) {
    return get(state, "restaurant_list.data", []);
  },
  restaurantPagination(state) {
    return get(state, "restaurant_list.pageable", {});
  },
  totalRestaurant(state) {
    return get(state, "restaurant_list.pageable.total_record", 0)
  },
  isFetchingList(state) {
    return state.isFetchingList;
  },
  restaurantListLength(state) {
    return get(state, "restaurant_list.data.length", 0);
  },
  restaurantDetail(state) {
    return get(state, "restaurant_detail", {});
  },
  restaurantComments(state) {
    return get(state, "restaurant_comments.data", []);
  },
  restaurantRelated(state) {
    return get(state, "restaurant_related.items", []);
  },
  restaurantCommentCurrentPage(state) {
    return get(state, "restaurant_comments.pageable.index", 0)
  },
  isRestaurantCommentLastPage(state) {
    const index = get(state, "restaurant_comments.pageable.index", 0)
    const totalPage = get(state, "restaurant_comments.pageable.total_page", 0)
    return (index === totalPage || totalPage === 0)
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   *   {base_url}restaurant/list?area=1&type_of_dish=1&price_range=1&type_of_store=1&order_by=1&currency=1&lang=1
   */
  async [restaurantActionTypes.GET_RESTAURANT_LIST]({ commit }, payload) {
    try {
      commit(restaurantMutationTypes.SET_RESTAURANT_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.RESTAURANT_LIST}`, {
        params: {...payload, 
          page_index: get(payload, 'page_index', PAGER.PAGE_INDEX),
          page_size: get(payload, 'page_size', PAGER.PAGE_SIZE),
        }
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(restaurantMutationTypes.SET_RESTAURANT_LIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(restaurantMutationTypes.SET_RESTAURANT_IS_FETCHING_LIST, true);
    }
  },

  /**
   *   {base_url}restaurant/detail?restaurant_id=1
   */
  async [restaurantActionTypes.GET_RESTAURANT_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.RESTAURANT_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(restaurantMutationTypes.SET_RESTAURANT_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}restaurant/booking
   */
  async [restaurantActionTypes.POST_RESTAURANT_BOOKING]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.RESTAURANT_BOOKING}`, payload);
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}restaurant/comment?restaurant_id=1
   */
  async [restaurantActionTypes.GET_RESTAURANT_COMMENT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.RESTAURANT_COMMENT}`, {
        params: {...payload, 
          page_index: get(payload, 'page_index', PAGER.PAGE_INDEX),
          page_size: get(payload, 'page_size', PAGER.PAGE_SIZE),
        }
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        if (payload.page_index && payload.page_index === 1) {
          commit(restaurantMutationTypes.SET_RESTAURANT_COMMENT, result.data);
        }
        if (payload.page_index && payload.page_index > 1) {
          commit(restaurantMutationTypes.SET_RESTAURANT_COMMENT_UPDATE, { ...result.data, end: payload.page_index * payload.page_size });
        }
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

   /**
   *   {base_url}restaurant/comment/detail?comment_id=1
   */
  async [restaurantActionTypes.GET_RESTAURANT_COMMENT_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.RESTAURANT_COMMENT_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(restaurantMutationTypes.SET_RESTAURANT_COMMENT_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}restaurant/related?restaurant_id=1
   */
  async [restaurantActionTypes.GET_RESTAURANT_RELATED]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.RESTAURANT_RELATED}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(restaurantMutationTypes.SET_RESTAURANT_RELATED, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   * Get around location restaurant
   */
  async getAroundLocationRestaurant({ commit }, payload) {
    try {
      commit(restaurantMutationTypes.SET_RESTAURANT_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_RESTAURANT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_RESTAURANT, result);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(restaurantMutationTypes.SET_RESTAURANT_IS_FETCHING_LIST, true);
    }
  },
};


/**
 * initial mutations
 */
const mutations = {
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_RESTAURANT](state, _data) {
    state.restaurant_list = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_LIST](state, _data) {
    state.restaurant_list = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_IS_FETCHING_LIST](state, _data) {
    state.isFetchingList = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_DETAIL](state, _data) {
    state.restaurant_detail = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_RELATED](state, _data) {
    state.restaurant_related = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_COMMENT](state, _data) {
    state.restaurant_comments = _data;
  },
  [restaurantMutationTypes.SET_RESTAURANT_POST_COMMENT](state, _data) {
    state.restaurant_comments.data = [ _data, ...state.restaurant_comments.data ];
  },
  [restaurantMutationTypes.SET_RESTAURANT_COMMENT_UPDATE](state, _data) {
    state.restaurant_comments.data = [...state.restaurant_comments.data,  ..._data.data].slice(0, _data.end);
    state.restaurant_comments.pageable = _data.pageable
  },
  [restaurantMutationTypes.SET_RESTAURANT_COMMENT_REPLY_UPDATE](state, _data) {
    const addNewReply
    = map(state.restaurant_comments.data, (comment) => {
      if (comment.comment_id === _data.reply_comment_id) {
        if (isArray(comment.reply_comments)) {
          comment.reply_comments.push(_data)
        } else {
          comment.reply_comments = [_data]
        }
      }
      return {
        ...comment
      }
    })
    state.restaurant_comments.data = addNewReply;
  },
  [restaurantMutationTypes.SET_RESTAURANT_COMMENT_DETAIL](state, _data) {
    const addNewReply
    = map(state.restaurant_comments.data, (comment) => {
      if (comment.comment_id === get(_data[0], 'reply_comment_id', null)) {
        comment.reply_comments = _data
      }
      return {
        ...comment
      }
    })
    state.restaurant_comments.data = addNewReply;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
