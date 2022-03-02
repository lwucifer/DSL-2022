import { get, map, isArray } from 'lodash';
import * as hotelActionTypes from '~/utils/action-type/hotel';
import * as configs from '~/utils/configs';
import * as APIs from '~/utils/endpoints';
import * as hotelMutationTypes from '~/utils/mutation-type/hotel';
import * as aroundLocationActionTypes from '~/utils/action-type/aroundLocation';
import * as aroundLocationMutationTypes from '~/utils/mutation-type/aroundLocation';

/**
 * initial state
 */
const state = () => ({
  banner: {},
  hotel_list: {},
  hotel_list_data: [],
  hotel_detail: {},
  hotel_comments: {
    data: [],
    pageable: {}
  },
  hotel_related: [],
  isFetchingList: true,
  isMap: false
});

/**
 * initial getters
 */
const getters = {
  hotelList(state) {
    return get(state, "hotel_list.data", []);
  },
  hotelPagination(state) {
    return get(state, "hotel_list.pageable", {});
  },
  isFetchingList(state) {
    return state.isFetchingList;
  },
  totalHotel(state) {
    return get(state, "hotel_list.pageable.total_record", 0)
  },
  hotelRelatedData (state) {
    return get(state, "hotel_related.items", [])
  },
  hotelCommentCurrentPage(state) {
    return get(state, "hotel_comments.pageable.index", 0)
  },
  isHotelCommentLastPage(state) {
    const index = get(state, "hotel_comments.pageable.index", 0)
    const totalPage = get(state, "hotel_comments.pageable.total_page", 0)
    return (index === totalPage || totalPage === 0)
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   * Get Banner
   */
  async [hotelActionTypes.GET_HOTEL_BANNER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_BANNER}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(hotelMutationTypes.SET_HOTEL_BANNER, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *  {base_url}hotel/list?order_by=1&area=1&checkout_time=14:00&checkin_time=20:00&price_range=1&rank=1&type=1&room_type=1&currency=1&lang=1
   */
  async [hotelActionTypes.GET_HOTEL_LIST]({ commit }, payload) {
    try {
      commit(hotelMutationTypes.SET_HOTEL_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.HOTEL_LIST}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(hotelMutationTypes.SET_HOTEL_LIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(hotelMutationTypes.SET_HOTEL_IS_FETCHING_LIST, false);
    }

  },

  /**
   *   {base_url}hotel/detail?hotel_id=1
   */
  async [hotelActionTypes.GET_HOTEL_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(hotelMutationTypes.SET_HOTEL_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}hotel/booking
   */
  async [hotelActionTypes.POST_HOTEL_BOOKING]({ commit }, payload) {
    try {
      const result = await this.$axios.post(`${APIs.HOTEL_BOOKING}`, {
        params: payload
      });
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}hotel/comment?hotel_id=1
   */
  async [hotelActionTypes.GET_HOTEL_COMMENT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_COMMENT}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        if (payload.page_index && payload.page_index === 1) {
          commit(hotelMutationTypes.SET_HOTEL_COMMENT, result.data);
        }
        if (payload.page_index && payload.page_index > 1) {
          commit(hotelMutationTypes.SET_HOTEL_COMMENT_UPDATE, { ...result.data, end: payload.page_index * payload.page_size });
        }
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

   /**
   *   {base_url}hotel/comment/detail?comment_id=1
   */
  async [hotelActionTypes.GET_HOTEL_COMMENT_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_COMMENT_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(hotelMutationTypes.SET_HOTEL_COMMENT_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   *   {base_url}hotel/related?hotel_id=1
   */
  async [hotelActionTypes.GET_HOTEL_RELATED]({ commit, state }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_RELATED}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(hotelMutationTypes.SET_HOTEL_RELATED, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [hotelActionTypes.POST_HOTEL_FAVORITE]({ commit, state }, payload) {
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
        const newHotelList = {
          ...state.hotel_list,
          data: state.hotel_list.data
            ? state.hotel_list.data.map((hotel) => {
              if (hotel.hotel_id === id) {
                return {
                  ...hotel,
                  is_favorite: isFavorite
                };
              }
              return hotel;
            })
            : []
        };
        commit(hotelMutationTypes.SET_HOTEL_LIST, newHotelList);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [hotelActionTypes.POST_HOTEL_DETAIL_FAVORITE](
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
        const newHotelDetail = {
          ...state.hotel_detail,
          is_favorite: isFavorite
        };
        commit(hotelMutationTypes.SET_HOTEL_DETAIL, newHotelDetail);
      }

      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   * Get around location hotel
   */
  async getAroundLocationHotel({ commit }, payload) {
    try {
      commit(hotelMutationTypes.SET_HOTEL_IS_FETCHING_LIST, true);
      const result = await this.$axios.get(`${APIs.AROUND_LOCATION_HOTEL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(aroundLocationMutationTypes.SET_AROUND_LOCATION_HOTEL, result);
      }
      return result || {};
    } catch (err) {
      return err;
    } finally {
      commit(hotelMutationTypes.SET_HOTEL_IS_FETCHING_LIST, true);
    }
  },

  async [hotelActionTypes.POST_HOTEL_BOOKING_CHECK]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_BOOKING_CHECK_REST_ROOM}`, {
        params: payload
      });
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [hotelActionTypes.GET_HOTEL_BOOKING_CHECK_HOTEL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOTEL_BOOKING_CHECK_REST_ROOM_HOTEL}`, {
        params: payload
      });
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
  [aroundLocationMutationTypes.SET_AROUND_LOCATION_HOTEL](state, _data) {
    state.isMap = true;
    state.hotel_list = _data;
  },
  [hotelMutationTypes.SET_HOTEL_BANNER](state, _data) {
    state.banner = _data;
  },
  [hotelMutationTypes.SET_HOTEL_LIST](state, _data) {
    state.isMap = false;
    state.hotel_list = _data;
  },
  [hotelMutationTypes.SET_HOTEL_IS_FETCHING_LIST](state, _data) {
    state.isFetchingList = _data;
  },
  [hotelMutationTypes.SET_HOTEL_DETAIL](state, _data) {
    state.hotel_detail = _data;
  },
  [hotelMutationTypes.SET_HOTEL_RELATED](state, _data) {
    state.hotel_related = _data;
  },
  [hotelMutationTypes.SET_HOTEL_COMMENT](state, _data) {
    state.hotel_comments = _data;
  },
  [hotelMutationTypes.SET_HOTEL_POST_COMMENT](state, _data) {
    state.hotel_comments.data = [ _data, ...state.hotel_comments.data ];
  },
  [hotelMutationTypes.SET_HOTEL_COMMENT_UPDATE](state, _data) {
    state.hotel_comments.data = [...state.hotel_comments.data,  ..._data.data].slice(0, _data.end);
    state.hotel_comments.pageable = _data.pageable
  },
  [hotelMutationTypes.SET_HOTEL_COMMENT_REPLY_UPDATE](state, _data) {
    const addNewReply
    = map(state.hotel_comments.data, (comment) => {
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
    state.hotel_comments.data = addNewReply;
  },
  [hotelMutationTypes.SET_HOTEL_COMMENT_DETAIL](state, _data) {
    const addNewReply
    = map(state.hotel_comments.data, (comment) => {
      if (comment.comment_id === get(_data[0], 'reply_comment_id', null)) {
        comment.reply_comments = _data
      }
      return {
        ...comment
      }
    })
    state.hotel_comments.data = addNewReply;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
