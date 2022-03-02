import * as newsActionTypes from '~/utils/action-type/news';
import * as newsMutationTypes from '~/utils/mutation-type/news';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';
import { NEW_TYPE } from '~/utils/constants';

import { get, map, isArray } from 'lodash';

/**
 * initial state
 */
const state = () => ({
  category_news: [],
  list_news: {},
  detail: {},
  news_related: {},
  news_banner: [],
  news_related_iscare: [],
  new_comments: {
    data: [],
    pageable: {}
  }
});

/**
 * initial getters
 */
const getters = {
  listNewsItems(state) {
    return get(state, 'list_news.items', []);
  },
  listNewsRelated(state) {
    return get(state, 'news_related.items', []);
  },
  newsRelatedIscareData (state) {
    return get(state, "news_related_iscare", [])
  },
  newCommentCurrentPage(state) {
    return get(state, "new_comments.pageable.index", 0)
  },
  isNewCommentLastPage(state) {
    const index = get(state, "new_comments.pageable.index", 0)
    const totalPage = get(state, "new_comments.pageable.total_page", 0)
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
  async [newsActionTypes.GET_CATEGORY_NEWS]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_CATEGORY}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_CATEGORY_NEWS, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_LIST_NEWS]({ commit }, payload) {
    try {
      if (payload.type == NEW_TYPE.SALE) {
        const result = await this.$axios.get(`${APIs.SALE_LIST}`, {
          params: payload
        });
        if (result.code == configs.RES_STATUS_SUCCESS) {
          commit(newsMutationTypes.SET_LIST_NEWS, result.data);
        }
      } else {
        const result = await this.$axios.get(`${APIs.NEWS_LIST}`, {
          params: payload
        });
        if (result.code == configs.RES_STATUS_SUCCESS) {
          commit(newsMutationTypes.SET_LIST_NEWS, result.data);
        }
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_NEWS_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_NEWS_DETAIL, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_NEWS_RELATED]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_RELATED}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_NEWS_RELATED, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_NEWS_BANNER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.BANNER_CONFIG}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_NEWS_BANNER, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_NEWS_RELATED_ISCARE]({ commit, state }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_RELATED_ISCARE}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_NEWS_RELATED_ISCARE, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [newsActionTypes.GET_NEWS_COMMENT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_COMMENT}`, {
        params: payload
      });
      console.log('newsActionTypes.GET_NEWS_COMMENT', result)
      if (result.code == configs.RES_STATUS_SUCCESS) {
        if (payload.page_index && payload.page_index === 1) {
          commit(newsMutationTypes.SET_NEWS_COMMENT, result.data);
        }
        if (payload.page_index && payload.page_index > 1) {
          commit(newsMutationTypes.SET_NEWS_COMMENT_UPDATE, {
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
   *   {base_url}hotel/comment/detail?comment_id=1
   */
  async [newsActionTypes.GET_NEWS_COMMENT_DETAIL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.NEWS_COMMENT_DETAIL}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(newsMutationTypes.SET_NEWS_COMMENT_DETAIL, result.data);
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
  [newsMutationTypes.SET_CATEGORY_NEWS](state, _data) {
    state.category_news = _data;
  },

  [newsMutationTypes.SET_LIST_NEWS](state, _data) {
    state.list_news = _data;
  },

  [newsMutationTypes.SET_NEWS_DETAIL](state, _data) {
    state.detail = _data;
  },

  [newsMutationTypes.SET_NEWS_RELATED](state, _data) {
    state.news_related = _data;
  },

  [newsMutationTypes.SET_NEWS_BANNER](state, _data) {
    state.news_banner = _data;
  },

  [newsMutationTypes.SET_NEWS_RELATED_ISCARE](state, _data) {
    state.news_related_iscare = _data;
  },

  [newsMutationTypes.SET_NEWS_COMMENT](state, _data) {
    state.new_comments = _data;
  },
  [newsMutationTypes.SET_NEWS_POST_COMMENT](state, _data) {
    state.new_comments.data = [ _data, ...state.new_comments.data ];
  },
  [newsMutationTypes.SET_NEWS_COMMENT_UPDATE](state, _data) {
    state.new_comments.data = [
      ...state.new_comments.data,
      ..._data.data
    ].slice(0, _data.end);
    state.new_comments.pageable = _data.pageable;
  },
  [newsMutationTypes.SET_NEWS_COMMENT_REPLY_UPDATE](state, _data) {
    const addNewReply
    = map(state.new_comments.data, (comment) => {
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
    state.new_comments.data = addNewReply;
  },
  [newsMutationTypes.SET_NEWS_COMMENT_DETAIL](state, _data) {
    const addNewReply = map(state.new_comments.data, (comment) => {
      if (comment.comment_id === get(_data[0], 'reply_comment_id', null)) {
        comment.reply_comments = _data;
      }
      return {
        ...comment
      };
    });
    state.new_comments.data = addNewReply;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
