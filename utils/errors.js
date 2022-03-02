function translate(_lang) {
  return !!this[_lang] ? this[_lang] : this.default;
}
const DB_ERROR = {
  0: {
    code: 'SUCCESS',
    default: 'Success',
    vi: 'Thành công',
    translate
  },
  999: {
    code: 'SYSTEM_ERROR',
    default: 'System Error',
    vi: 'Lỗi không xác định',
    translate
  },
  1002: {
    code: 'USER_OR_PASS_INCORECT',
    default: 'Username or Password was wrong',
    vi: 'Sai tên đăng nhập hoặc mật khẩu',
    translate
  },
  1005: {
    code: 'EMAIL_EXIST',
    default: 'Username or Password was wrong',
    vi: 'Email đã tồn tại trên hệ thống',
    translate
  },
  1029: {
    code: 'SESSION_NOT_EXIST',
    default: 'Session not exist',
    vi: 'Session không tồn tại trên hệ thống',
    translate
  },
  1038: {
    code: 'COMPARE_ITEM_EXISTED',
    default: 'compare item existed',
    vi: 'Sản phẩm đã tồn tại trong danh sách so sánh',
    translate
  },
  1039: {
    code: 'COMPARE_ITEM_NOT_MATCH_TYPE',
    default: 'compare item not match type',
    vi: 'Sản phẩm không cùng loại',
    translate
  },

  //   USER_OR_PASS_INCORECT: 1002,
  ACCOUNT_NOT_ACTIVE: 1003,
  ACCOUNT_IS_LOCKED: 1004,
  EMAIL_EXIST: 1005,
  EMAIL_NOT_EXIST: 1006,
  OTP_NOT_EXIST: 1007,
  OTP_IS_USED: 1008,
  OTP_IS_EXPIRED: 1009,
  USER_NOT_EXISTS: 1010
};

const API_ERROR = {
  UNKNOWN: 99,
  TOKEN_INVALID: 1,
  TOKEN_EXPIRED: 2,
  REQUEST_INVALID: 3,
  4: {
    code: 'SEND_MAIL_ERROR',
    default: 'Send mail error',
    vi: 'Gửi mail lỗi',
    translate
  },
  3: {
    code: 'OTP_NULL_EMPTY !',
    default: 'OTP not null or empty',
    vi: 'Mã xác thực không được để trống. Vui lòng nhập mã xác thực',
    translate
  },
  1031: {
    code: 'REST_ROOM_NOT_AVAILABLE',
    default: 'Rest room not available',
    vi: 'Phòng nghỉ không đạt yêu cầu',
    translate
  },
  1006: {
    code: 'EMAIL_NOT_EXIST',
    default: 'Email not exist',
    vi: 'Rất tiếc! Email của bạn chưa được đăng ký',
    translate
  },
  1007: {
    code: 'OTP_NOT_EXIST',
    default: 'OTP not exist',
    vi:
      ' Mã xác thực không đúng, bạn vui lòng click Gửi lại mã xác thực và thử lại',
    translate
  },
  1008: {
    code: 'OTP_IS_USED',
    default: 'OTP is used',
    vi: ' Mã otp này đã được sử dụng',
    translate
  },
  1003: {
    code: 'ACCOUNT_NOT_ACTIVE',
    default: 'Account not active',
    vi: 'Tài khoản chưa được kích hoạt',
    translate
  },
  1036: {
    code: 'ACCOUNT_ALREADY_PASSWORD',
    default: 'Account already password',
    vi: 'Tài khoản đã có mật khẩu',
    translate
  },
  ACCOUNT_NOT_ACTIVE: 1003
};

export const ALL_ERROR = {
  ...DB_ERROR,
  ...API_ERROR
};
