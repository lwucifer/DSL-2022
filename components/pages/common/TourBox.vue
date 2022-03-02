<template>
  <div class="tour-box" :class="classes">
    <div class="tour-box__img">
      <n-link :to="to" :exact="exact">
        <img v-bind="imgAttrs" />

        <div
          v-if="status && status !== PRODUCT_STATUS.ACTIVE"
          class="tour-box__disabled-overlay"
        >
          <IconSad class="icon mr-16" />
          {{
            status === PRODUCT_STATUS.DISABLED
              ? $t('hotel.not_working')
              : $t('home.out_of_seat')
          }}
        </div>
      </n-link>

      <div v-if="hasActions" class="tour-box__actions">
        <slot name="add">
          <div
            class="destination-box__action-btn add"
            :title="$t('hotel.compare')"
            @click.prevent="$emit('add', $props)"
            v-if="isAddable"
          >
            <IconAdd class="icon" />
          </div>
        </slot>
        <a
          class="tour-box__action-btn heart"
          :class="{ active: isLiked }"
          href=""
          :title="$t('home.save') + $t('home.to_list_favourite')"
          @click.prevent.stop="$emit('like', $props)"
        >
          <IconHeart class="icon icon-active-hide" />
          <IconHeartFilled class="icon icon-active-show" />
        </a>
        <a
          v-if="hasBtnShare"
          class="tour-box__action-btn share"
          href=""
          title="Share"
          @click.prevent="openShareThis = true"
        >
          <IconShare class="icon" />
          <ShareThis
            :url="baseUrl + to"
            :title="title"
            :tag="title"
            :description="title"
            :image="imgAttrs.src"
            :width="600"
            centered
            v-model="openShareThis"
            @cancel="openShareThis = false"
          />
        </a>
      </div>

      <div v-if="hasPrice" class="tour-box__price">
        <div
          v-if="$slots.priceStrike || priceStrike"
          class="tour-box__price-item tour-box__price-item--strike"
        >
          <slot name="priceStrike">{{ priceStrike }}</slot>
        </div>
        <div
          v-if="$slots.price || price"
          class="tour-box__price-item tour-box__price-item--blue"
        >
          <slot name="price">{{ price }}</slot>
        </div>
        <div
          v-if="$slots.priceRed || priceRed"
          class="tour-box__price-item tour-box__price-item--red"
        >
          <slot name="priceRed">{{ priceRed }}</slot>
        </div>
      </div>

      <div v-if="hasClose" class="tour-box__close-overlay">
        <span class="tour-box__close">
          <span></span>
        </span>
      </div>
    </div>

    <div class="tour-box__body">
      <h4 class="tour-box__title">
        <n-link :to="to" :exact="exact">
          {{ title }}
        </n-link>
      </h4>

      <div class="tour-box__body-row">
        <div class="tour-box__rating">
          <!-- <AppStars :stars="rating" />
          ({{ ratingCount }}) -->
          {{$t('home.evaluation')}}: {{rating > 0 ? rating.toFixed(1) + '/5.0 ' + ' (' + ratingCount + ')' : $t('home.not_evaluation') }}
        </div>
        <span v-if="durationDay || durationNight" class="tour-box__duration">
          <IconClock class="icon" />{{
            durationDay ? `${durationDay} ` + $t('hotel.day') : ''
          }}{{ durationNight ? ` ${durationNight} ` + $t('hotel.night') : '' }}
        </span>
      </div>

      <div class="tour-box__body-row">
        <n-link :to="startTo" v-if="start"
          >{{ $t('home.start_gate') }}: {{ start }}</n-link
        >
        <n-link :to="destinationTo" v-if="destinationCount"
          >{{ destinationCount || 0 }} {{ $t('home.destination') }}</n-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { PRODUCT_STATUS } from '~/utils/constants';
import AppStars from '~/components/app/AppStars';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconAdd from '~/assets/icons/add.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import IconShare from '~/assets/icons/share-outline.svg?inline';
import IconClock from '~/assets/icons/clock-2.svg?inline';
import IconSad from '~/assets/icons/sad.svg?inline';
import ShareThis from '~/components/pages/common/ShareThis';

export default {
  components: {
    AppStars,
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconClock,
    IconSad,
    ShareThis,
    IconAdd
  },

  data() {
    return {
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      openShareThis: false
    };
  },

  props: {
    title: String,
    rating: Number,
    ratingCount: Number,
    durationDay: Number,
    durationNight: Number,
    start: String,
    startTo: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
    destinationCount: Number,
    destinationTo: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
    imgAttrs: {
      type: Object,
      default: () => ({})
    },
    to: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
    exact: Boolean, // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    hasClose: Boolean,
    square: Boolean,
    isLiked: {
      type: Boolean
    },
    type: {
      type: String, // type of display this box, rely on design, has following opts: 'box', 'no-box'
      default: 'box'
    },
    hasActions: {
      type: Boolean,
      default: true
    },
    hasBtnShare: Boolean,
    isAddable: Boolean,
    hasPrice: Boolean,
    price: [Number, String],
    priceStrike: [Number, String],
    priceRed: [Number, String],
    status: [Number]
  },

  computed: {
    classes() {
      return {
        'tour-box--square': this.square,
        'tour-box--no-box': this.type === 'no-box',
        'tour-box--has-close': this.hasClose,
        'tour-box--has-price': this.hasPrice,
        'tour-box--not-active': this.status !== PRODUCT_STATUS.ACTIVE
      };
    }
  },

  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_tour-box.scss';
</style>
