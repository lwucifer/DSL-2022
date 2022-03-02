import { checkRequestAuthorize, removeToken } from '~/utils/auth';
import { translateErrorCode } from '~/utils/common';
import {
  ACCOUNT_IS_DELETED,
  ACCOUNT_IS_LOCKED,
  RES_STATUS_SUCCESS,
  INVALID_TOKEN_CODE
} from '~/utils/configs';
import * as authMutationTypes from '~/utils/mutation-type/auth';
import * as commonMutationTypes from '~/utils/mutation-type/common';

export default function ({ store, $axios, params, route, app }) {
  $axios.onRequest((config) => {
    // console.log(
    //   '[onRequest]',
    //   config.url,
    //   // route.params,
    //   // params,
    //   // store.state.common.common.menuConfig,
    //   store.state.common.common.defaultLang.id,
    //   app.i18n.locale,
    //   config.params
    // );

    config.params = {
      ...config.params,
      lang: store.state.common.common.defaultLang.id
    };

    if (checkRequestAuthorize(config.url)) {
      if (!!store.getters['auth/auth/isAuthenticated']) {
        config.headers.common[
          'Authorization'
        ] = `Bearer ${store.state.auth.auth.access_token}`;
      }
    } else {
      config.headers.common = {};
    }
  });

  $axios.onResponse((response) => {
    const currentLangCode = store.state.common.common.defaultLang.code;
    const { error, data } = response.data;
    const { code, message } = error;
    const { url } = response.config;

    if (code != RES_STATUS_SUCCESS) {
      // console.log(
      //   '[response]',
      //   error,
      //   message,
      //   response.data,
      //   response.request.path
      // );
    }
    if (code === ACCOUNT_IS_DELETED || code === ACCOUNT_IS_LOCKED) {
      store.commit(`auth/auth/${authMutationTypes.REMOVE_TOKEN}`);
      store.commit(
        `common/eventBus/${commonMutationTypes.SET_MODAL_ACCOUNT_DELETE}`,
        true
      );
    }
    
    if (code === INVALID_TOKEN_CODE) {
      removeToken();

      if (process.browser) {
        localStorage.setItem('history_search', JSON.stringify([]));
        window.location.reload();
      }
    }

    return {
      code,
      message:
        code == RES_STATUS_SUCCESS
          ? message
          : translateErrorCode(currentLangCode, code),
      data
    };
  });

  $axios.onRequestError((err) => {
    console.log('onRequestError', err);
  });

  $axios.onResponseError((error) => {
    console.log('[onResponseError]', error);
  });

  $axios.onError((error) => {
    console.log('[onError]', error);
  });
}
