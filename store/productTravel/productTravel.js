import { get, map, isArray } from 'lodash';

import * as productTravelActionTypes from '~/utils/action-type/productTravel';
import * as productTravelMutationTypes from '~/utils/mutation-type/productTravel';
import * as aroundLocationMutationTypes from '~/utils/mutation-type/aroundLocation';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';
import { PAGER } from '~/utils/constants';

/**
 * initial state
 */
const state = () => ({
  productTravelList: {},
  productTravel_detail: {},
  productTravel_comments: [],
  productTravel_related: [],
});

/**
 * initial getters
 */
const getters = {
  productTravelList(state) {
    return get(state, 'productTravelList.data', []);
  },
  productTravelPagination(state) {
    return get(state, 'productTravelList.pageable', {});
  },
  totalProductTravel(state) {
    return get(state, 'productTravelList.pageable.total_record', 0);
  },
  productTravelDetail(state) {
    return get(state, 'productTravel_detail', {});
  },
  productTravelComment(state) {
    return get(state, 'productTravel_comments', []);
  },
  productTravelRelated(state) {
    return get(state, 'productTravel_related.items', []);
  },
  productTravelCommentCurrentPage(state) {
    return get(state, 'productTravel_comments.pageable.index', 0);
  },
  isProductTravelCommentLastPage(state) {
    const index = get(state, 'productTravel_comments.pageable.index', 0);
    const totalPage = get(
      state,
      'productTravel_comments.pageable.total_page',
      0
    );
    return index === totalPage || totalPage === 0;
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   *   {base_url}productTravel/list?area=1&type_of_dish=1&price_range=1&type_of_store=1&order_by=1&currency=1&lang=1
   */
  async [productTravelActionTypes.GET_PRODUCT_TRAVEL_LIST](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(`${APIs.PRODUCT_TRAVEL_LIST}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(productTravelMutationTypes.SET_PRODUCT_TRAVEL_LIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}productTravel/detail?productTravel_id=1
   */
  async [productTravelActionTypes.GET_PRODUCT_TRAVEL_DETAIL](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(`${APIs.PRODUCT_TRAVEL_DETAL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          productTravelMutationTypes.SET_PRODUCT_TRAVEL_DETAIL,
          result.data || {}
        );
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}productTravel/booking
   */
  async [productTravelActionTypes.POST_PRODUCT_TRAVEL_BOOKING](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.post(`${APIs.PRODUCT_TRAVEL_BOOKING}`, {
        params: payload
      });
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}productTravel/comment?productTravel_id=1
   */
  async [productTravelActionTypes.GET_PRODUCT_TRAVEL_COMMENT](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(`${APIs.PRODUCT_TRAVEL_COMMENT}`, {
        params: {
          ...payload,
          page_index: get(payload, 'page_index', PAGER.PAGE_INDEX),
          page_size: get(payload, 'page_size', PAGER.PAGE_SIZE)
        }
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        if (payload.page_index && payload.page_index === 1) {
          commit(
            productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT,
            result.data
          );
        }
        if (payload.page_index && payload.page_index > 1) {
          commit(productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT_UPDATE, {
            ...result.data,
            end: payload.page_index * payload.page_size
          });
        }
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [productTravelActionTypes.GET_PRODUCT_TRAVEL_RELATED](
    { commit, state },
    payload
  ) {
    try {
      const result = await this.$axios.get(`${APIs.PRODUCT_TRAVEL_RELATED}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          productTravelMutationTypes.SET_PRODUCT_TRAVEL_RELATED,
          result.data
        );
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [productTravelActionTypes.GET_PRODUCT_TRAVEL_COMMENT_DETAIL](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.PRODUCT_TRAVEL_COMMENT_DETAIL}`,
        {
          params: payload
        }
      );
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT_DETAIL,
          result.data
        );
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },
  async [productTravelActionTypes.POST_PRODUCT_TRAVEL_DETAIL_FAVOURITE](
    { commit, state },
    payload
  ) {
    try {
      const { id, type, isFavorite } = payload;
      const result = await this.$axios.post(
        APIs[isFavorite ? 'FAVORITE_ADD' : 'FAVORITE_REMOVE'],
        {
          id,
          type
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        const newProductTravelDetail = {
          ...state.productTravel_detail,
          is_favorite: isFavorite
        };
        commit(productTravelMutationTypes.SET_PRODUCT_TRAVEL_DETAIL, newProductTravelDetail);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  },

    /**
   * Get around location restaurant
   */
  async getAroundLocationProductTravel({ commit }, payload) {
    try {
      //commit(productTravelMutationTypes.SET_PRODUCT_TRAVEL_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_PRODUCT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_PRODUCT, result);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      //commit(productTravelMutationTypes.SET_PRODUCT_TRAVEL_IS_FETCHING_LIST, true);
    }
  },
};

/**
 * initial mutations
 */
const mutations = {
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_PRODUCT](state, _data) {
    state.productTravelList = _data;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_LIST](state, _data) {
    state.productTravelList = _data;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_DETAIL](state, _data) {
    state.productTravel_detail = _data;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT](state, _data) {
    state.productTravel_comments = _data;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_RELATED](state, _data) {
    state.productTravel_related = _data;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_POST_COMMENT](state, _data) {
    state.productTravel_comments.data = [
      _data,
      ...state.productTravel_comments.data
    ];
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT_REPLY_UPDATE](
    state,
    _data
  ) {
    const addNewReply = map(state.productTravel_comments.data, (comment) => {
      if (comment.comment_id === _data.reply_comment_id) {
        if (isArray(comment.reply_comments)) {
          comment.reply_comments.push(_data);
        } else {
          comment.reply_comments = [_data];
        }
      }
      return {
        ...comment
      };
    });
    state.productTravel_comments.data = addNewReply;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT_DETAIL] (state, _data) {
    const addNewReply = map(state.productTravel_comments.data, (comment) => {
      if (comment.comment_id === get(_data[0], 'reply_comment_id', null)) {
        comment.reply_comments = _data;
      }
      return {
        ...comment
      };
    });
    state.productTravel_comments.data = addNewReply;
  },
  [productTravelMutationTypes.SET_PRODUCT_TRAVEL_COMMENT_UPDATE] (state, _data) {
    state.productTravel_comments.data = [
      ...state.productTravel_comments.data,
      ..._data.data
    ].slice(0, _data.end);
    state.productTravel_comments.pageable = _data.pageable;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
