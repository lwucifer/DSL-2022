import { get, map, isArray } from 'lodash';

import * as tourActionTypes from '~/utils/action-type/tour';
import * as tourMutationTypes from '~/utils/mutation-type/tour';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

/**
 * initial state
 */
const state = () => ({
  banner: [],
  tourList: {},
  tourDetail: {},
  tourComments: {
    data: [],
    pageable: {}
  },
  tourRelated: {},
  isFetchingList: true
});

/**
 * initial getters
 */
const getters = {
  tourList(state) {
    return get(state, 'tourList.data', []) || [];
  },
  tourPagination(state) {
    return get(state, 'tourList.pageable', {});
  },
  totalTour(state) {
    return get(state, 'tourList.pageable.total_record', 0);
  },
  isFetchingList(state) {
    return state.isFetchingList;
  },
  tourCommentCurrentPage(state) {
    return get(state, 'tourComments.pageable.index', 0);
  },
  isTourCommentLastPage(state) {
    const index = get(state, 'tourComments.pageable.index', 0);
    const totalPage = get(state, 'tourComments.pageable.total_page', 0);
    return index === totalPage || totalPage === 0;
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   * Get Banner
   */
  async [tourActionTypes.GET_TOUR_BANNER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_BANNER}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(tourMutationTypes.SET_TOUR_BANNER, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}tour/list?area=1&type_of_dish=1&price_range=1&type_of_store=1&order_by=1&currency=1&lang=1
   */
  async [tourActionTypes.GET_TOUR_LIST]({ commit }, payload) {
    try {
      commit(tourMutationTypes.SET_TOUR_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.TOUR_LIST}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(tourMutationTypes.SET_TOUR_LIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(tourMutationTypes.SET_TOUR_IS_FETCHING_LIST, true);
    }
  },

  /**
   *   {base_url}tour/detail?tour_id=1
   */
  async [tourActionTypes.GET_TOUR_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_DETAL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(tourMutationTypes.SET_TOUR_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}tour/booking
   */
  async [tourActionTypes.POST_TOUR_BOOKING]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.TOUR_BOOKING}`, {
        params: payload
      });
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}tour/comment?tour_id=1
   */
  async [tourActionTypes.GET_TOUR_COMMENT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_COMMENT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        if (payload.page_index && payload.page_index === 1) {
          commit(tourMutationTypes.SET_TOUR_COMMENT, result.data);
        }
        if (payload.page_index && payload.page_index > 1) {
          commit(tourMutationTypes.SET_TOUR_COMMENT_UPDATE, {
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

  /**
   *   {base_url}tour/comment/detail?tour_id=1
   */
  async [tourActionTypes.GET_TOUR_COMMENT_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_COMMENT_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(tourMutationTypes.SET_TOUR_COMMENT_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },
  /**
   *   {base_url}transaction/detail
   */
  async [tourActionTypes.GET_DETAIL_RESET]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.DETAIL_RESET}`, {
        params: payload
      });
      return result || {};
    } catch (err) {
      return err;
    }
  },
  /**
   *   {base_url}user/add_to_comparison_list
   * ${APIs.ADD_COMPARE}?productId=${payload.productId}&productType=${payload.productType}
   */
  async [tourActionTypes.POST_ADD_COMPARE]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.ADD_COMPARE}`, payload);
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [tourActionTypes.POST_TOUR_FAVORITE]({ commit, state }, payload) {
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
        const newTourList = {
          ...state.tourList,
          data: state.tourList.data
            ? state.tourList.data.map((tour) => {
                if (tour.tour_id === id) {
                  return {
                    ...tour,
                    is_favorite: isFavorite
                  };
                }
                return tour;
              })
            : []
        };
        commit(tourMutationTypes.SET_TOUR_LIST, newTourList);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [tourActionTypes.POST_TOUR_DETAIL_FAVORITE](
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
        const newTourDetail = {
          ...state.tourDetail,
          is_favorite: isFavorite
        };
        commit(tourMutationTypes.SET_TOUR_DETAIL, newTourDetail);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [tourActionTypes.GET_TOUR_RELATED]({ commit, state }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.TOUR_RELATED}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(tourMutationTypes.SET_TOUR_RELATED, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [tourActionTypes.POST_TOUR_RELATED_FAVORITE](
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
        const newTourList = {
          ...state.tourRelated,
          data: state.tourRelated.data
            ? state.tourRelated.data.map((tour) => {
                if (tour.tour_id === id) {
                  return {
                    ...tour,
                    is_favorite: isFavorite
                  };
                }
                return tour;
              })
            : []
        };
        commit(tourMutationTypes.SET_TOUR_RELATED, newTourList);
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
  [tourMutationTypes.SET_TOUR_BANNER](state, _data) {
    state.banner = _data;
  },
  [tourMutationTypes.SET_TOUR_LIST](state, _data) {
    state.tourList = _data;
  },
  [tourMutationTypes.SET_TOUR_IS_FETCHING_LIST](state, _data) {
    state.isFetchingList = _data;
  },
  [tourMutationTypes.SET_TOUR_DETAIL](state, _data) {
    state.tourDetail = _data;
  },
  [tourMutationTypes.SET_TOUR_COMMENT](state, _data) {
    state.tourComments = _data;
  },
  [tourMutationTypes.SET_TOUR_RELATED](state, _data) {
    state.tourRelated = _data;
  },
  [tourMutationTypes.SET_TOUR_COMMENT](state, _data) {
    state.tourComments = _data;
  },
  [tourMutationTypes.SET_TOUR_POST_COMMENT](state, _data) {
    state.tourComments.data = [_data, ...state.tourComments.data];
  },
  [tourMutationTypes.SET_TOUR_COMMENT_UPDATE](state, _data) {
    state.tourComments.data = [...state.tourComments.data, ..._data.data].slice(
      0,
      _data.end
    );
    state.tourComments.pageable = _data.pageable;
  },
  [tourMutationTypes.SET_TOUR_COMMENT_REPLY_UPDATE](state, _data) {
    const addNewReply = map(state.tourComments.data, (comment) => {
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
    state.tourComments.data = addNewReply;
  },
  [tourMutationTypes.SET_TOUR_COMMENT_DETAIL](state, _data) {
    const addNewReply = map(state.tourComments.data, (comment) => {
      if (comment.comment_id === get(_data[0], 'reply_comment_id', null)) {
        comment.reply_comments = _data;
      }
      return {
        ...comment
      };
    });
    state.tourComments.data = addNewReply;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
