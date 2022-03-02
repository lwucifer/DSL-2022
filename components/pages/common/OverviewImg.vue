<template>
  <section
    class="overview-img pa-16 bg-white animated fadeIn"
    :class="{ 'overview-img--disabled': status !== PRODUCT_STATUS.ACTIVE }"
  >
    <div class="overview-img__head">
      <div class="overview-img__head-left">
        <slot name="title">
          <h1 class="overview-img__title heading-4">{{ title }}</h1>
        </slot>
        <span
          v-if="address || $scopedSlots.address"
          class="overview-img__address"
        >
          <slot name="address"><IconPin class="mr-2" />{{ address }}</slot>
        </span>
      </div>

      <div class="overview-img__head-right">
        <a
          class="overview-img__favorite"
          :title="$t('hotel.share')"
          href=""
          v-if="share"
          @click.prevent="openShareThis = true"
        >
          <IconShare class="icon" />
        </a>

        <a
          class="overview-img__favorite"
          :class="{ active: isFavorite }"
          :title="
            !isFavorite
              ? $t('home.save') + ' ' + $t('home.to_list_favourite')
              : $t('home.delete') + ' ' + $t('home.from_list_favourite')
          "
          href=""
          @click.prevent="$emit('favorite', isFavorite)"
        >
          <IconHeart class="icon icon-active-hide" />
          <IconHeartFilled class="icon icon-active-show" />
        </a>

        <slot name="booking">
          <v-button
            class="overview-img__btn-booking"
            nuxt
            :to="disableButtonBook ? '' : btnBookingLink"
            :variant="disableButtonBook ? 'dark' : 'primary'"
            >{{ btnBookingText }}</v-button
          >
        </slot>
      </div>
    </div>

    <div class="overview-img__grid overview-img__grid--6-items">
      <div
        v-for="(i, index) in 6"
        :key="index"
        class="overview-img__grid-item"
        :class="{ 'overview-img__grid-item--empty': !images[index] }"
        @click="(event) => handleClickImage(event, i, index)"
      >
        <img v-if="images[index]" :src="images[index].url" alt="" />
        <ImagePlaceholder v-else preserveAspectRatio="xMidYMid slice" />

        <span v-if="images.length > 6 && i == 6" class="overview-img__grid-num"
          >+{{ images.length - 6 }}</span
        >
      </div>

      <div
        v-if="status && status !== PRODUCT_STATUS.ACTIVE"
        class="overview-img__disabled-overlay"
      >
        <IconSad class="icon mr-16" />
        {{
          status === PRODUCT_STATUS.DISABLED
            ? $t('hotel.not_working')
            : setFullyBookedText(productType)
        }}
      </div>
    </div>

    <v-modal
      :width="1200"
      :title="title"
      :footer="false"
      :centered="true"
      :visible="modalGallery"
      modal-class="overview-img__modal-gallery"
      header-class="pa-16"
      body-class="px-16 pb-16 pt-0"
      @cancel="modalGallery = false"
    >
      <OverviewImgGallery
        :images="images"
        :default-index="modalGalleryDefaultIndex"
      />
    </v-modal>

    <ShareThis
      :url="baseUrl + shareLink"
      :title="title"
      :tag="title"
      :description="title"
      :width="600"
      centered
      v-model="openShareThis"
      @cancel="openShareThis = false"
    />
  </section>
</template>

<script>
import { PRODUCT_STATUS, PRODUCT_TYPE } from '~/utils/constants';
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import IconSad from '~/assets/icons/sad.svg?inline';
import IconShare from '~/assets/icons/share-outline.svg?inline';
import ImagePlaceholder from '~/assets/images/image-placeholder.svg?inline';
import OverviewImgGallery from '~/components/pages/common/OverviewImgGallery';

export default {
  components: {
    IconPin,
    IconHeart,
    IconHeartFilled,
    IconSad,
    IconShare,
    ImagePlaceholder,
    OverviewImgGallery
  },

  props: {
    title: String,
    address: String,
    isFavorite: Boolean,
    btnBookingText: String,
    shareLink: {
      type: [String, Object],
      default: ''
    },
    btnBookingLink: {
      type: [String, Object],
      default: ''
    },
    images: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) => ['url', 'type'].every((key) => key in item))
    },
    disableButtonBook: {
      type: Boolean,
      default: false
    },
    status: Number,
    productType: [String, Number],
    share: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      openShareThis: false,
      modalGallery: false,
      modalGalleryDefaultIndex: 0
    };
  },

  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  },

  methods: {
    handleClickImage(event, item, index) {
      event.preventDefault();

      this.modalGallery = true;
      this.modalGalleryDefaultIndex = index;
    },

    setFullyBookedText(type) {
      switch (type) {
        case PRODUCT_TYPE.HOTEL:
          return this.$t('hotel.out_of_room');
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return this.$t('restaurant.out_of_table');
          break;
        case PRODUCT_TYPE.TOUR:
          return this.$t('home.out_of_seat');
          break;
        case PRODUCT_TYPE.PRODUCT:
          return this.$t('product.out_of_stock');
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_overview-img.scss';
</style>
