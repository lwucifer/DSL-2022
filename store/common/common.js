import * as commonActionTypes from '~/utils/action-type/common';
import * as commonMutationTypes from '~/utils/mutation-type/common';
import * as APIs from '~/utils/endpoints';
import * as configs from '~/utils/configs';

import { get } from 'lodash';
/**
 * initial state
 */
const state = () => ({
  menu: [],
  weather: {},
  aqi: {},
  searchCommon: {},
  suggestion_most: {},
  suggestion_best: {},
  defaultLang: {},
  defaultCurrency: {},
  defaultOrderBy: {},
  defaultNation: {},
  tourSearch: {},
  currencies: [],
  languages: [],
  sorting_criterias: [],
  nations: [],
  menuConfig: {},
  list_footer: {},
  detail_footer: {},
  systemDefaultConfig: {},
  systemDefaultLang: {},
  checkMailExist: {},
  suggestionHotel: {},
  suggestionRestaurant: {},
  suggestionTour: {},
  suggestionTravel: {},
});

/**
 * initial getters
 */
const getters = {
  getAqi(state) {
    return `${get(state, 'aqi.data.0.aqi', '51')}`;
  },
  searchCommonItems(state) {
    return get(state, 'searchCommon.data', []);
  },
  searchCommonPagination(state) {
    return get(state, 'searchCommon.pageable', {});
  },
  totalSearchCommon(state) {
    return get(state, 'searchCommon.pageable.total_record', 0);
  },
  selectSortingCriterias(state) {
    return get(state, 'sorting_criterias', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  selectCurrencies(state) {
    return get(state, 'currencies', []).map((a) => {
      return {
        value: a.id,
        text: a.code,
        sign: a.name
      };
    });
  },
  selectLanguages(state) {
    return get(state, 'languages', []).map((a) => {
      return {
        value: a.id,
        text: a.name
      };
    });
  },
  currentExchangeRate(state) {
    const currencyPrice = parseFloat(
      get(state, 'defaultCurrency.exchange_rate', 1)
    );
    const vnd = get(state, 'currencies', []).find((v) => v.code == 'VND');
    const vndPrice = get(vnd, 'exchange_rate', 1);
    return parseFloat(currencyPrice / vndPrice);
  },
  currentUnitCode(state) {
    return get(state.defaultCurrency, 'code', 'VND');
  },
  homeUrl(state) {
    // const home = get(state, 'menuConfig', []).find(m => m.page_type == 1);
    // return get(home, 'page_link', '/');
    return '/';
  },
  menuMappingObj(state) {
    return get(state, 'menuConfig', []).reduce((obj, menu) => {
      obj[menu.page_type_name] = menu.page_id;
      return obj;
    }, {});
  },
  defaultLangCode(state) {
    return get(state, 'defaultLang.code', 'vi').toLowerCase();
  }
};

/**
 * initial actions
 */
const actions = {
  /**
   * {base_url}utilities/menu
   */
  async [commonActionTypes.GET_UTILITIES_MENU]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_MENU}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_MENU, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/weather?province=Yen Bai
   */
  async [commonActionTypes.GET_UTILITIES_WEATHER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_WEATHER}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_WEATHER, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {{url}}utilities/aqi?province=Yen Bai
   */
  async [commonActionTypes.GET_UTILITIES_AQI]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_UTILITIES_AQI}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_AQI, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}statistic/search?keyword=x&lang=1&page_index=1&page_size=10
   */
  async [commonActionTypes.GET_STATISTIC_SEARCH]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_STATISTIC_SEARCH}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_STATISTIC_SEARCH, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}statistic/suggestion/most_searched?size=3
   */
  async [commonActionTypes.GET_STATISTIC_SUGGESTION_MOST]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_STATISTIC_SUGGESTION_MOST}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_STATISTIC_SUGGESTION_MOST, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}statistic/suggestion/best_tourist_attractions
   */
  async [commonActionTypes.GET_STATISTIC_SUGGESTION_BEST]({ commit }, payload) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_STATISTIC_SUGGESTION_BEST}`,
        { params: payload }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_STATISTIC_SUGGESTION_BEST, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * http://103.147.34.20:9040/api/file/v1/upload?folder_dir=images&channel=FILE&transid=xxx123
   */
  async [commonActionTypes.UPLOAD_FILE]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        `${APIs.COMMON_UPLOAD_FILE}?folder_dir=${payload.folder_dir}`,
        payload.formData
      );

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {{url}}rating/evaluate
   */
  async [commonActionTypes.POST_RATING_EVALUATE]({ commit }, payload) {
    try {
      const result = await this.$axios.post(
        `${APIs.COMMON_RATING_EVALUEATE}`,
        payload
      );

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {{url}}utilities/default_config_info
   */
  async [commonActionTypes.GET_UTILITIES_DEFAULT_CONFIG_INFO](
    { commit },
    params
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_DEFAULT_CONFIG_INFO}`,
        {params}
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(
          commonMutationTypes.SET_UTILITIES_DEFAULT_CONFIG_INFO,
          result.data
        );
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/currency
   */
  async [commonActionTypes.GET_UTILITIES_CURRENCY]({ commit }, params) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_CURRENCY}`,
        {params}
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_CURRENCY, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}utilities/language
   */
  async [commonActionTypes.GET_UTILITIES_LANGUAGE]({ commit }, params) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_LANGUAGE}`,
        {params}
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_LANGUAGE, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {{url}}utilities/sorting_criteria?lang=1
   */
  async [commonActionTypes.GET_UTILITIES_SORTING_CRITERIA](
    { commit },
    payload
  ) {
    try {
      const result = await this.$axios.get(
        `${APIs.COMMON_UTILITIES_SORTING_CRITERIA}`,
        {
          params: payload
        }
      );

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_SORTING_CRITERIA, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_TOUR_SEARCH]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.HOME_TOUR}`, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_TOUR_SEARCH, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_UTILITIES_NATION]({ commit }, payload) {
    try {
      const result = await this.$axios.get(APIs.COMMON_UTILITIES_NATION, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_UTILITIES_NATION, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}user/check_email_exist
   */
  async [commonActionTypes.GET_USER_CHECK_EMAIL_EXIST]({ commit }, payload) {
    try {
      const result = await this.$axios.get(APIs.COMMON_USER_CHECK_EMAIL_EXIST, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_CHECK_MAIL_EXIST, result.data);
      }
      return result || {};
    } catch (err) {
      return err;
    }
  },

  async [commonActionTypes.GET_MENU_CONFIG]({ commit }, payload) {
    try {
      const result = await this.$axios.get(APIs.MENU_CONFIG, {
        params: payload
      });
      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_MENU_CONFIG, result.data);
      }
      return result.data || {};
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/home/footer/pages
   */
  async [commonActionTypes.GET_LIST_FOOTER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.LIST_FOOTER}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_LIST_FOOTER, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/home/footer/pages/detail
   */
  async [commonActionTypes.GET_DETAIL_FOOTER]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.DETAIL_FOOTER}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_DETAIL_FOOTER, result.data);
      }
      return data;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/
   */
  async [commonActionTypes.GET_REAL_URL_BY_KEY]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_REAL_URL_BY_KEY}`, {
        params: payload
      });

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/statistic/suggestion/hotel
   */
   async [commonActionTypes.GET_SUGGESTION_HOTEL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_STATISTIC_SUGGESTION_HOTEL}`, {
        params: payload
      });

      console.log("GET_SUGGESTION_HOTEL", result);

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_SUGGESTION_HOTEL, result.data);
      }

      return result;
    } catch (err) {
      return err;
    }
  },


  /**
   * {base_url}/statistic/suggestion/restaurant
   */
   async [commonActionTypes.GET_SUGGESTION_RESTAURANT]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_STATISTIC_SUGGESTION_RESTAURANT}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_SUGGESTION_RESTAURANT, result.data);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/statistic/suggestion/tour
   */
   async [commonActionTypes.GET_SUGGESTION_TOUR]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_STATISTIC_SUGGESTION_TOUR}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_SUGGESTION_TOUR, result.data);
      }

      return result;
    } catch (err) {
      return err;
    }
  },

  /**
   * {base_url}/statistic/suggestion/tour
   */
   async [commonActionTypes.GET_SUGGESTION_TRAVEL]({ commit }, payload) {
    try {
      const result = await this.$axios.get(`${APIs.COMMON_STATISTIC_SUGGESTION_TRAVEL}`, {
        params: payload
      });

      if (result.code == configs.RES_STATUS_SUCCESS) {
        commit(commonMutationTypes.SET_SUGGESTION_TRAVEL, result.data);
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
  [commonMutationTypes.SET_UTILITIES_MENU](state, _data) {
    state.menu = _data;
  },
  [commonMutationTypes.SET_UTILITIES_WEATHER](state, _data) {
    state.weather = _data;
  },
  [commonMutationTypes.SET_UTILITIES_AQI](state, _data) {
    state.aqi = _data;
  },
  [commonMutationTypes.SET_STATISTIC_SEARCH](state, _data) {
    state.searchCommon = _data;
  },
  [commonMutationTypes.SET_STATISTIC_SUGGESTION_MOST](state, _data) {
    state.suggestion_most = _data;
  },
  [commonMutationTypes.SET_STATISTIC_SUGGESTION_BEST](state, _data) {
    state.suggestion_best = _data;
  },
  [commonMutationTypes.SET_UTILITIES_DEFAULT_CONFIG_INFO](state, _data) {
    state.defaultLang = _data.defaultLang;
    state.defaultCurrency = _data.defaultCurrency;
    state.defaultOrderBy = _data.defaultOrderBy;
    state.defaultNation = _data.defaultNation;
    state.systemDefaultConfig = _data;
    state.systemDefaultLang = _data.defaultLang;
  },
  [commonMutationTypes.SET_UTILITIES_CURRENCY](state, _data) {
    state.currencies = _data;
  },
  [commonMutationTypes.SET_UTILITIES_LANGUAGE](state, _data) {
    state.languages = _data;
  },
  [commonMutationTypes.SET_UTILITIES_SORTING_CRITERIA](state, _data) {
    state.sorting_criterias = _data;
  },
  [commonMutationTypes.SET_UTILITIES_DEFAULT_CONFIG_LANG](state, _data) {
    state.defaultLang = state.languages.find((l) => l.id == _data);
    state.defaultCurrency = state.currencies.find(
      (c) => c.id == state.defaultLang.default_currency_id
    );
  },
  [commonMutationTypes.SET_UTILITIES_DEFAULT_CONFIG_CURRENCY](state, _data) {
    state.defaultCurrency = state.currencies.find((l) => l.id == _data);
  },
  [commonMutationTypes.SET_TOUR_SEARCH](state, _data) {
    state.tourSearch = _data;
  },
  [commonMutationTypes.SET_UTILITIES_NATION](state, _data) {
    state.nations = _data;
  },
  [commonMutationTypes.SET_MENU_CONFIG](state, _data) {
    state.menuConfig = _data;
  },
  [commonMutationTypes.SET_LIST_FOOTER](state, _data) {
    state.list_footer = _data;
  },
  [commonMutationTypes.SET_DETAIL_FOOTER](state, _data) {
    state.detail_footer = _data;
  },
  [commonMutationTypes.SET_CHECK_MAIL_EXIST](state, _data){
    state.checkMailExist = _data;
  },

  [commonMutationTypes.SET_SUGGESTION_HOTEL](state, _data){
    state.suggestionHotel = _data;
  },
  [commonMutationTypes.SET_SUGGESTION_RESTAURANT](state, _data){
    state.suggestionRestaurant = _data;
  },
  [commonMutationTypes.SET_SUGGESTION_TOUR](state, _data){
    state.suggestionTour = _data;
  },
  [commonMutationTypes.SET_SUGGESTION_TRAVEL](state, _data){
    state.suggestionTravel = _data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
