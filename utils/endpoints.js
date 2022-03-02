/**
 * COMMON
 */
export const COMMON_UTILITIES_WEATHER = `/utilities/weather`;
export const COMMON_UTILITIES_AQI = `/utilities/aqi`;
export const COMMON_UTILITIES_MENU = `/utilities/menu`;
export const COMMON_STATISTIC_SEARCH = `/statistic/search`;
export const COMMON_STATISTIC_SUGGESTION_MOST = `/statistic/suggestion/most_searched?size=3`;
export const COMMON_STATISTIC_SUGGESTION_BEST = `/statistic/suggestion/best_tourist_attractions`;

export const COMMON_STATISTIC_SUGGESTION_HOTEL = `/statistic/suggestion/hotel`;
export const COMMON_STATISTIC_SUGGESTION_RESTAURANT = `/statistic/suggestion/restaurant`;
export const COMMON_STATISTIC_SUGGESTION_TOUR = `/statistic/suggestion/tour`;
export const COMMON_STATISTIC_SUGGESTION_TRAVEL = `/statistic/suggestion/product`;

export const COMMON_USER_INFO = `/user/info`;
export const COMMON_USER_NOTIFICATION_LIST_NEW = `/user/notification/list/new`;
export const COMMON_USER_NOTIFICATION_NEW_AMOUNT = `/user/notification/new/amount`;
export const COMMON_USER_NOTIFICATION_DETAIL = `/user/notification/detail`;
export const COMMON_USER_NOTIFICATION_LIST = `/user/notification/list`;
export const COMMON_USER_CHECK_EMAIL_EXIST = `/user/check_email_exist`;
export const COMMON_USER_CREATE_PASSWORD = `user/create_password`;

export const COMMON_UTILITIES_CURRENCY = `/utilities/currency`;
export const COMMON_UTILITIES_LANGUAGE = `/utilities/language`;
export const COMMON_UTILITIES_AREA = `/utilities/area`;
export const COMMON_UTILITIES_PROVINCE = `/utilities/province`;
export const COMMON_UTILITIES_DISTRICT = `/utilities/district`;
export const COMMON_UTILITIES_WARD = `/utilities/ward`;
export const COMMON_UTILITIES_RATING = `/utilities/rating`;
export const COMMON_UTILITIES_HOTEL_TYPE = `/utilities/hotel/type`;
export const COMMON_UTILITIES_DISH_TYPE = `/utilities/dish/type`;
export const COMMON_UTILITIES_RESTAURANT_TYPE = `/utilities/restaurant/type`;
export const COMMON_UTILITIES_PRICE_RANGE = `/utilities/price_range`;
export const COMMON_UTILITIES_TOUR_START_PLACE = `/utilities/tour/start_place`;
export const COMMON_UTILITIES_TOUR_TIME = `/utilities/tour/time`;
export const COMMON_UTILITIES_TOUR_TYPE = `/utilities/tour/type`;
export const COMMON_UTILITIES_SORTING_CRITERIA = `/utilities/sorting_criteria`;
export const COMMON_UTILITIES_DEFAULT_CONFIG_INFO = `/utilities/default_config_info`;
export const COMMON_UTILITIES_NATION = `/utilities/nation`;

export const COMMON_UPLOAD_FILE = `/file/v1/upload`;
export const COMMON_RATING_EVALUEATE = `/rating/evaluate`;

export const BANNER_CONFIG = `banner/config`;

export const COMMON_NEWSLETTER = `user/notification/news_letter`;
export const COMMON_CHECK_NEWSLETTER = `user/check_register_news_letter`;
export const COMMON_REAL_URL_BY_KEY = `seo/redirect`;

/**
 * HOME
 */
export const HOME_SLIDER_BANNER = `/home/banner`;
export const HOME_COMBO = '/home/combo';
export const HOME_HOTEL = '/home/hotel';
export const HOME_RESTAURANT = '/home/restaurant';
export const HOME_TOUR = '/home/tour';
export const HOME_VIDEO = '/home/video';
export const HOME_PARTNER = '/home/partner';
export const HOME_PRODUCT_CATEGORY = '/home/product_category';
export const HOME_TOURISM_PRODUCT_CATEGORY = '/home/category_product_travel';

/**
 * AUTH
 */
export const AUTH_USER_LOGIN = `/user/login`;
export const AUTH_USER_LOGOUT = `/user/logout`;
export const AUTH_USER_REGISTER = `/user/register`;
export const AUTH_USER_SSO_GOOGLE = `/user/sso/google`;
export const AUTH_USER_SSO_FACEBOOK = `/user/sso/facebook`;
export const AUTH_USER_REGISTER_OTP_VERIFY = `/user/register/otp/verify`;
export const AUTH_USER_FORGET_PASSWORD_OTP_VERIFY = `/user/forget_password/otp/verify`;
export const AUTH_USER_REGISTER_OTP_RESEND = `/user/register/otp/resend`;
export const AUTH_USER_FORGET_PASSWORD = `/user/forget_password`;
export const AUTH_USER_FORGET_PASSWORD_OTP_RESEND = `/user/forget_password/otp/resend`;
export const AUTH_USER_FORGET_PASSWORD_CHANGE_PASSWORD = `/user/change_password`;
export const AUTH_USER_UPDATE_NAME = `/user/update/name`;
export const AUTH_USER_UPDATE_AVATAR = `/user/update/avatar`;
export const AUTH_USER_UPDATE_PHONE = `/user/update/phone`;
export const AUTH_USER_UPDATE_PASSWORD = `/user/update/password`;
export const AUTH_USER_SUPERADMIN_LOGIN = `/user/superadmin/login`;
export const AUTH_USER_UPDATE_FIREBASE_TOKEN = `user/update/firebase_token`;

/**
 * COMPARE
 */
export const COMPARE_LIST = `/user/comparison_list`;
export const COMPARE_REMOVE = `/user/clear_comparison_list`;

/**
 * HOTEL
 */
export const HOTEL_LIST = `/hotel/list/v2`;
export const HOTEL_DETAIL = `/hotel/detail`;
export const HOTEL_BOOKING = `/hotel/booking`;
export const HOTEL_COMMENT = `/hotel/comment`;
export const HOTEL_COMMENT_DETAIL = `/hotel/comment/detail`;
export const HOTEL_RELATED = `/hotel/related`;
export const HOTEL_BANNER = `/banner/hotel`;
export const HOTEL_BOOKING_CHECK_REST_ROOM = `/hotel/booking/check_rest_room`;
export const HOTEL_BOOKING_CHECK_REST_ROOM_HOTEL = `hotel/booking/check_rest_room/hotel`;

/**
 * RESTAURANT
 */
export const RESTAURANT_LIST = `/restaurant/list/v2`;
export const RESTAURANT_DETAIL = `/restaurant/detail`;
export const RESTAURANT_BOOKING = `/restaurant/booking`;
export const RESTAURANT_COMMENT = `/restaurant/comment`;
export const RESTAURANT_COMMENT_DETAIL = `/restaurant/comment/detail`;

export const RESTAURANT_RELATED = `/restaurant/related`;
export const RESTAURANT_BANNER = `/banner/restaurant`;

/**
 * TOUR
 */
export const TOUR_LIST = `/tour/list/v2`;
export const TOUR_DETAL = `/tour/detail`;
export const TOUR_BOOKING = `/tour/booking`;
export const TOUR_COMMENT = `/tour/comment`;
export const TOUR_COMMENT_DETAIL = `/tour/comment/detail`;
export const TOUR_BANNER = `/banner/tour`;
export const TOUR_RELATED = `/tour/related`;


/**
 * PRODUCT TRAVEL
 */
export const PRODUCT_TRAVEL_LIST = `/product/list`;
export const PRODUCT_TRAVEL_DETAL = `/product/detail`;
export const PRODUCT_TRAVEL_BOOKING = `/product/booking`;
export const PRODUCT_TRAVEL_COMMENT = `/product/comment`;
export const PRODUCT_TRAVEL_RELATED = `/product/related`;
export const PRODUCT_TRAVEL_COMMENT_DETAIL = `/product/comment/detail`;
/**
 * NEWS
 */
export const NEWS_CATEGORY = `/post/category`;
export const SALE_LIST = `/sale/list`;
export const NEWS_LIST = `/news/list`;
export const NEWS_DETAIL = `/news/detail`;
export const SALE_DETAIL = `/sale/detail`;
export const NEWS_RELATED = `/post/related`;
export const NEWS_RELATED_ISCARE = `/post/product_related`;
export const NEWS_COMMENT = `/post/comment`;
export const NEWS_COMMENT_DETAIL = `/post/comment/detail`;

/**
 * TRANSACTION
 */
export const TRANSACTION_CALCULATE_PRICE_TOUR = `/transaction/calculate_price_tour`;
export const TRANSACTION_CALCULATE_PRICE_HOTEL = `/transaction/calculate_price_hotel`;
export const DETAIL_RESET = `/transaction/detail`;

/**
 * FAVORITE
 */
export const FAVORITE_LIST = `/favorite/list`;
export const FAVORITE_ADD = `/favorite/add`;
export const FAVORITE_REMOVE = `/favorite/remove`;
export const ADD_COMPARE = `/user/add_to_comparison_list`;

/**
 * AROUND LOCATION
 */
export const AROUND_LOCATION_HOTEL = `/around-location/hotel`;
export const AROUND_LOCATION_RESTAURANT = `/around-location/restaurant`;
export const AROUND_LOCATION_PRODUCT = `/around-location/products`;

// TRANSACTION BOOKING
export const HOTEL_TRANSACTION = `/transaction/hotel`;
export const TOUR_TRANSACTION = `/transaction/tour`;
export const RESTAURANT_TRANSACTION = `/transaction/restaurant`;
export const PRODUCTS_TRANSACTION = `/transaction/products`;    
export const CANCEL_TRANSACTION = `/transaction/update_status`;

/**
 * MENU
 */
export const MENU_CONFIG = `/menu/config_info`;

/**
 * FOOTER
 */
export const LIST_FOOTER = `/home/footer/pages`;
export const DETAIL_FOOTER = `/home/footer/pages/detail`;

/**
 * PAYMENT
 */
export const PAYMENT_URL = `/payment/vnp/createPayUrl`;
export const GET_TRANSACTION_DETAIL = `/transaction/get_detail_by_trans_id`;
