import * as commonActionTypes from '~/utils/action-type/common';
import { get } from 'lodash';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

const state = () => ({});

const actions = {
  async nuxtServerInit({ commit, dispatch }, { req, store, app, redirect }) {
    // const userCookies = getTokenFromCookie(req);
    console.log('[nuxtServerInit]', req.originalUrl);
    const shortcutUrl = req.originalUrl;
    if (!!shortcutUrl) {
      const urlParsing = shortcutUrl.split('/seo/');
      if (urlParsing && urlParsing.length == 2) {
        const urlSeo = `${process.env.BASE_URL_API}/seo/redirect?seo_url=${urlParsing[1]}`;
        console.log('[urlSeo]', urlSeo);
        // get real url here, then redirect to that url and return;
        redirect(`${urlSeo}`);
        return;
        // const result = await dispatch(
        //   `common/common/${commonActionTypes.GET_REAL_URL_BY_KEY}`,
        //   { seo_url: shortId }
        // );
        // if(result.code == RES_STATUS_SUCCESS) {
        //   const url = result.data.url;
        //   redirect(url);
        //   return;
        // }
      }
    }
    await dispatch(
      `common/common/${commonActionTypes.GET_UTILITIES_DEFAULT_CONFIG_INFO}`,
      { code: app.i18n.locale }
    );

    await dispatch(`common/common/${commonActionTypes.GET_MENU_CONFIG}`);
    await dispatch(`common/common/${commonActionTypes.GET_UTILITIES_WEATHER}`, {
      province: 'Mong Cai'
    });
    dispatch(`common/common/${commonActionTypes.GET_UTILITIES_LANGUAGE}`);
    dispatch(`common/common/${commonActionTypes.GET_UTILITIES_CURRENCY}`);
    // dispatch(
    //   `common/common/${commonActionTypes.GET_UTILITIES_SORTING_CRITERIA}`
    // );
    await dispatch(`common/common/${commonActionTypes.GET_UTILITIES_AQI}`, {
      province: 'Mong Cai'
    });
  }
};

const getters = {};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
