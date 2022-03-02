<template>
  <div class="booking-box">
    <div class="booking-box__left">
      <div class="booking-box__img">
        <n-link :to="to">
          <img :src="image" :alt="name" />
        </n-link>
        <v-tooltip
          v-if="statusIcon"
          class="booking-box__status-icon"
          placement="top"
          :content="statusText"
        >
          <component slot="activator" :is="statusIcon" />
        </v-tooltip>
      </div>

      <span
        class="booking-box__label d-xl-none"
        :class="`booking-box__label--${labelVariant}`"
        >{{ statusText }}</span
      >
    </div>

    <div class="booking-box__center">
      <div class="booking-box__center-top mb-2">
        <n-link :to="to" class="d-inline-block">
          <h3 class="booking-box__name heading-5 mb-0">{{ name }}</h3>
        </n-link>
        <span
          class="booking-box__label d-none d-xl-inline-block"
          :class="`booking-box__label--${labelVariant}`"
          >{{ statusText }}</span
        >
      </div>

      <slot name="description"></slot>

      <p v-if="note || $slots.note" class="booking-box__note">
        <slot name="note">{{ note }}</slot>
      </p>

      <slot v-if="showPrice" name="price">
        <p>
          {{ $t('booking.payment') }}:
          <b class="body-1 secondary ml-2">{{ priceText }}</b>
        </p>
      </slot>
    </div>

    <div class="booking-box__right">
      <slot name="content-right" :status="status"></slot>
    </div>
  </div>
</template>

<script>
import { ORDER_STATUS, ORDER_STATUS_TEXT } from '~/utils/constants';
import IconTimeCircleFilled from '~/assets/icons/time-circle-filled.svg?inline';
import IconCheckCircleFilled from '~/assets/icons/check-circle-filled.svg?inline';
import IconReload from '~/assets/icons/icon_1.svg?inline';

const PENDING_STATUS = [
  ORDER_STATUS.PENDING, //Gửi yêu cầu, đang xử lý
  ORDER_STATUS.CONFIRMED_UNPAID, // Đã xác nhận, chưa thanh toán
  ORDER_STATUS.CANCELING, //Đang huỷ
  ORDER_STATUS.DELIVERING //Đang giao hàng
];
const SUCCESS_STATUS = [ORDER_STATUS.SUCCESS, ORDER_STATUS.PAID];
const CANCEL_STATUS = [
  ORDER_STATUS.REJECT, //Từ chối xác nhận
  ORDER_STATUS.CANCELED, //Đã huỷ
  ORDER_STATUS.CLOSED //Đã đóng
];

export default {
  components: {
    IconTimeCircleFilled,
    IconCheckCircleFilled,
    IconReload
  },

  props: {
    note: String,
    name: String,
    to: {
      type: String,
      default: ''
    },
    image: String,
    priceText: String,
    showPrice: Boolean,
    status: {
      type: [Number, String],
      default: '',
      validator: (value) => ['', ...Object.values(ORDER_STATUS)].includes(value)
    }
  },

  computed: {
    labelVariant() {
      if (SUCCESS_STATUS.includes(this.status)) {
        return 'primary';
      }
      if (PENDING_STATUS.includes(this.status)) {
        return 'orange';
      }
      if (CANCEL_STATUS.includes(this.status)) {
        return 'danger';
      }
    },

    statusIcon() {
      if (SUCCESS_STATUS.includes(this.status)) {
        return IconCheckCircleFilled;
      }
      if (PENDING_STATUS.includes(this.status)) {
        return IconTimeCircleFilled;
      }
      if (CANCEL_STATUS.includes(this.status)) {
        return IconReload;
      }
    },

    statusText() {
      let text = '';
      for (const key in ORDER_STATUS) {
        if (this.status === ORDER_STATUS[key]) {
          text = this.$t(ORDER_STATUS_TEXT[key]);
          break;
        }
      }
      return text;
    }
  },

  created() {
    this.ORDER_STATUS = Object.freeze(ORDER_STATUS);
    this.PENDING_STATUS = Object.freeze(PENDING_STATUS);
    this.CANCEL_STATUS = Object.freeze(CANCEL_STATUS);
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/account/_booking-box.scss';
</style>
