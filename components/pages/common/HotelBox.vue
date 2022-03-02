<template>
  <div class="hotel-box">
    <div class="hotel-box__img">
      <n-link :to="to"><img :src="imgAttrs" /></n-link>

      <a
        href=""
        class="icon-heart"
        :class="{ active: isLiked }"
        @click.prevent="$emit('like', $props)"
      >
        <IconHeart class="icon icon-active-hide" />
        <IconHeartFilled class="icon icon-active-show" />
      </a>
    </div>

    <div class="hotel-box__info">
      <n-link :to="to" class="name-hotel">{{ title }}</n-link>

      <div class="hotel-box__rating">
        <!-- <AppStars :stars="rating" /> -->
        {{$t('home.evaluation')}}: {{rating > 0 ? rating.toFixed(1) + '/5.0 ' + ' (' + ratingCount + ')' : $t('home.not_evaluation') }}
        
      </div>
      <div class="local-hotel"><IconPin /> {{ address }}</div>

      <div class="btn-hotel">
        <v-button nuxt to="" class="btn-hotel-left">
          {{$t("home.hotel")}} {{ levelHotel }} <IconStar class="icon ml-2 mt-1"/>
        </v-button>

        <v-button nuxt to="" class="btn-hotel-right">
          {{$t("hotel.form")}} <span class="ml-2"> {{ fromPrice | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }} / </span>&nbsp; {{$t("hotel.night")}}
        </v-button>
      </div>
    </div>
  </div>
</template>

<script>

import AppStars from '~/components/app/AppStars';
import IconPin from '~/assets/icons/pin.svg?inline';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import IconStar from '~/assets/icons/star-2.svg?inline';

import { mapGetters } from 'vuex';

export default {
  components: {
    AppStars,
    IconPin,
    IconHeart,
    IconHeartFilled,
    IconStar
  },

  props: {
    imgAttrs: String,
    isLiked: Boolean,
    title: String,
    to: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
    rating: Number,
    ratingCount: Number,
    address: String,
    levelHotel: String,
    fromPrice: Number,
    currencyCode: String
  },

  computed: {
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode']),
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/common/_hotel-box.scss';
</style>
