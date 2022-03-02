import numeral from 'numeral';
import Vue from 'vue';
import { PRICE_FORMAT } from '~/utils/constants';

/**
 * 10000 => 10,000, 10.000
 * @param {Number} num
 * @param {String} format
 */
export function numeralFormat(num, format = PRICE_FORMAT) {
  return numeral(num).format(format);
}
export function isNullOrEmpty(str) {
  return (str = null || str === undefined || str === '');
}

export function aqiFilter(aqi) {

  if (!aqi || aqi == '0' || isNaN(parseFloat(aqi))) return '';
  const aqiNum = parseFloat(aqi);
  if (0 <= aqiNum && aqiNum <= 50) {
    return "header.good";
  } else if (50 < aqiNum && aqiNum <= 100) {
    return "header.medium";
  } else if (100 < aqiNum && aqiNum <= 150) {
    return "header.prety_bad";
  } else if (150 < aqiNum && aqiNum <= 200) {
    return "header.prety_bad";
  } else if (200 < aqiNum && aqiNum <= 300) {
    return "header.very_bad";
  } else if (300 < aqiNum) {
    return "header.danger";
  } else {
    return "header.medium";
  }
}

export function priceTransform(_price, _exchangeRate) {
  return parseFloat(_price) / parseFloat(_exchangeRate);
}

const filters = {
  numeralFormat,
  aqiFilter,
  priceTransform,
  isNullOrEmpty
};

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
