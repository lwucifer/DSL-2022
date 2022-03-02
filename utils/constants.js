export const THEME_VARIANT_LIST = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'dark',
  'light'
];

export const COMPONENT_SIZE_LIST = ['md', 'sm', 'lg'];

export const PRODUCT_TYPE = {
  HOTEL: 1,
  RESTAURANT: 2,
  TOUR: 3,
  PRODUCT: 4,
  POST: 5,
  NEW: 5
};

export const PRODUCT_STATUS = {
  ACTIVE: 1,
  DISABLED: 2,
  OUT_OF_STOCK: 3
};

export const GALLERY_TYPE = {
  IMAGE: 1,
  VIDEO: 2
};

export const CONVENIENT_SERVICES = {
  PARKING: {
    name: 'Bãi đậu xe miễn phí',
    icon: 'parking'
  },
  PAYMENT_CARD: {
    name: 'Thanh thoán bằng thẻ',
    icon: 'credit-card'
  },
  WIFI: {
    name: 'Wifi',
    icon: 'wifi'
  },
  BILL: {
    name: 'Hóa đơn đỏ',
    icon: 'credit-card'
  }
};

export const PAGER = {
  PAGE_INDEX: 1,
  PAGE_SIZE: 9,
  PAGE_SIZE_LIMIT: 9990
};

export const ORDER_STATUS = {
  PENDING: 0,
  REJECT: 1,
  CONFIRMED_UNPAID: 2,
  PAID: 3,
  DELIVERING: 4,
  CANCELING: 5,
  CANCELED: 6,
  SUCCESS: 7,
  CLOSED: 8
};

export const ORDER_STATUS_TEXT = {
  PENDING: 'product.wait_confirm',
  REJECT: 'product.decline_confirm',
  CONFIRMED_UNPAID: 'product.comfirmed_unpaid',
  PAID: 'product.paid',
  DELIVERING: 'product.shipping',
  CANCELING: 'product.canceling',
  CANCELED: 'product.canceled',
  SUCCESS: 'booking.success',
  CLOSED: 'product.closed'
};

export const PAYMENT_TYPE = {
  CASH: 1,
  ONLINE: 2
};

export const ORDER_TYPE = {
  RETAIL: 1,
  WHOLESALE: 2,
  PRE_ORDER: 3
};

export const COMMENTS = {
  PAGE_SIZE: 5
};

export const TIME_SHOW_POPUP = 60000;

export const READ_NOTI = {
  UNREAD: 0,
  READ: 1
};

export const NOTI_TYPE = {
  REPLY_COMMENT: 1,
  LOGIN: 2
};

export const RANGE_SLIDER_VALUE = {
  MIN: 0,
  MAX: 9999999999,
  MAX_DISPLAY: 10000000,
  STEP: 50000
};

export const PRICE_FORMAT = '0,0.[00]';

export const NEW_TYPE = {
  NORMAL: 1,
  SALE: 2,
  BASIC: 3
};

export const TOUR_DEPARTURE_TYPE = {
  DAILY: 1,
  WEEKLY: 2,
  PLAN: 3
};

export const NEWSLETTER = {
  REGISTED: 1037,
  NOT_REGISTER: 0
};

export const MENU_PAGE_TYPE = {
  SALE: 4,
  NEWS: 5,
  HOTEL: 6,
  RESTAURANT: 7,
  TOUR: 8,
  PRODUCT: 9
};
