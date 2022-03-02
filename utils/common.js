import { ALL_ERROR } from './errors';
import { get } from 'lodash';

//
export const isBrowser =
  typeof window !== 'undefined' && typeof document !== undefined;

/**
 * To set size of vue component.
 * @param {[String, Number]} size
 */
export function setPropSize(size) {
  if (typeof size === 'number') {
    return size + 'px';
  }

  if (typeof size === 'string') {
    !isNaN(parseInt(size)) ? size : null;
  }

  return null;
}

/**
 * To get key code of key event then run callback
 */
export function dispatchForCode(event, callback) {
  let code;

  if (event.key !== undefined) {
    code = event.key;
  } else if (event.keyCode !== undefined) {
    code = event.keyCode;
  } else {
    code = event.code;
  }

  callback(code);
}

/**
 * To get base64 of img file
 * @param { File } img
 * @param { Function } callback
 */
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * To convert text from camelCase to snake_case
 */
export function camelCaseToSnakeCase(s) {
  return s
    .replace(/\.?([A-Z]+)/g, function (x, y) {
      return '_' + y.toLowerCase();
    })
    .replace(/^_/, '');
}

/**
 * To convert text from snake_case || kebab-case to camelCase
 * @param {*} str
 */
export const toCamelCase = (str) =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );

/**
 * Convert query to vue data
 */
export function convertQueryValue(query, key, defaultValue) {
  if (query[key] != null && query[key] != undefined && query[key] !== '') {
    if (query[key].includes(',')) {
      return query[key]
        .split(',')
        .map((item) => (!isNaN(item) ? parseFloat(item) : item));
    }

    if (Array.isArray(defaultValue)) {
      return !isNaN(query[key]) ? [parseFloat(query[key])] : [query[key]];
    }

    return !isNaN(query[key]) ? parseFloat(query[key]) : query[key];
  } else {
    return defaultValue;
  }
}

export function convertSearchPayload(data) {
  if (!data) return '';
  let queryStr = {};
  for (const key in data) {
    if (data[key] != null && data[key] !== '') {
      const keyInSnakeCase = camelCaseToSnakeCase(key);
      queryStr[keyInSnakeCase] = Array.isArray(data[key])
        ? data[key].join(',')
        : data[key];
    }
  }

  return queryStr || '';
}

/**
 * Translate ERROR_CODE => MULTI LANGUAGES MESSAGE
 *
 */
export function translateErrorCode(_lang, _code) {
  const tmpCode = ALL_ERROR[_code] || false;
  if (tmpCode) {
    if (tmpCode.translate && typeof tmpCode.translate == 'function') {
      return tmpCode.translate(_lang);
    } else {
      return tmpCode.default;
    }
  }
  return 'Unknown Error';
}

export function getPageIdFromLink(_link, _menuConfig) {

  if (!_link || !_menuConfig) return null;

  const urls = _link.split('/');
  if (!urls || urls.length < 1) return;
  const checkingLink = get(urls, '1', '');
  let pageId = null;

  for (var i = 0; i < _menuConfig.length; i++) {
    const p = _menuConfig[i];
    if (p.page_link.includes(`${checkingLink}`)) {
      pageId = p.page_id;
    }
  }

  return pageId;
}
