<template>
  <div class="destination-box" :class="classes" :title="title">
    <div class="destination-box__img">
      <n-link :to="to" :exact="exact" :title="title">
        <img v-bind="imgAttrs" />

        <div
          v-if="status && status !== PRODUCT_STATUS.ACTIVE"
          class="destination-box__disabled-overlay"
        >
          <IconSad class="icon mr-16" />
          {{
            status && status === PRODUCT_STATUS.DISABLED
              ? $t(disabledText)
              : setFullyBookedText(product_type)
          }}
        </div>
      </n-link>
      <div v-if="hasActions" class="destination-box__actions">
        <slot name="add">
          <div
            class="destination-box__action-btn add"
            :title="$t('hotel.compare')"
            @click.prevent="handleAddToList"
            v-if="isAddable"
          >
            <IconAdd class="icon" />
            <v-modal
              v-model="confirmDelete"
              :header="false"
              :width="1200"
              size="lg"
              centered
              @cancel="confirmDelete = false"
              @ok="changeDelete"
            >
              <div class="text-center">
                <h3 class="mb-5">
                  {{$t("tour.compare_not_same")}}
                </h3>
              </div>
            </v-modal>
          </div>
        </slot>
        <slot name="favorite">
          <a
            class="destination-box__action-btn heart"
            :class="{ active: favorite }"
            href=""
            :title="
              !favorite
                ? $t('home.save') + ' ' + $t('home.to_list_favourite')
                : $t('home.delete') + ' ' + $t('home.from_list_favourite')
            "
            @click.prevent.stop="handelFavorite(favorite)"
          >
            <IconHeart class="icon icon-active-hide" />
            <IconHeartFilled class="icon icon-active-show" />
          </a>
        </slot>
        <slot name="share">
          <div
            class="destination-box__action-btn share"
            :title="$t('hotel.share')"
            @click.prevent="openShareThis = true"
            v-if="isShare"
          >
            <IconShare class="icon" />
          </div>
        </slot>
      </div>

      <div class="destination-box__infor">
        <v-button class="destination-box__level" v-if="hasLevel">
          {{$t("home.hotel")}} {{ level }} <IconStar class="icon ml-2 mt-1"/>
        </v-button>

        <div v-if="hasPrice" class="destination-box__price">
          <div
            v-if="$slots.priceStrike || priceStrike"
            class="destination-box__price-item destination-box__price-item--strike"
          >
            <slot name="priceStrike">{{ priceStrike }}</slot>
          </div>
          <div
            v-if="$slots.price || price"
            class="destination-box__price-item destination-box__price-item--blue"
          >
            <slot name="price">{{ price }}</slot>
          </div>
          <div
            v-if="$slots.priceRed || priceRed"
            class="destination-box__price-item destination-box__price-item--red"
          >
            <slot name="priceRed">{{ priceRed }}</slot>
          </div>
        </div>
      </div>
      

      <div v-if="hasClose" class="destination-box__close-overlay">
        <span
          class="destination-box__close destination-box__action-btn heart active"
          @click="$emit('close', $props)"
        >
          <IconHeartFilled class="icon" />
        </span>
      </div>
    </div>

    <div class="destination-box__body">
      <h4 class="destination-box__title">
        <n-link :to="to" :exact="exact" :title="title">{{ title }} </n-link>
      </h4>
      <div class="destination-box__rating" v-if="showInfo">
        <!-- <AppStars :stars="rating" /> -->
        <!-- ({{ ratingCount }}) -->
        {{$t('home.evaluation')}}: {{rating > 0 ? rating.toFixed(1) + '/5.0 ' + ' (' + ratingCount + ')' : $t('home.not_evaluation') }}
        
      </div>
      <span class="destination-box__address" v-if="showInfo && address">
        <IconPin class="icon" />
        <span class="destination-box__address-text">{{ address }}</span>
      </span>
    </div>

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

    <ModalAuth
      v-model="modalSignIn"
      :width="600"
      centered
      @cancel="modalSignIn = false"
    >
      <FormSignIn />
    </ModalAuth>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { PRODUCT_TYPE, PRODUCT_STATUS } from '~/utils/constants';

import AppStars from '~/components/app/AppStars';
import ShareThis from '~/components/pages/common/ShareThis';
import IconAdd from '~/assets/icons/add.svg?inline';
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import IconShare from '~/assets/icons/share-outline.svg?inline';
import IconSad from '~/assets/icons/sad.svg?inline';
import IconStar from '~/assets/icons/star-2.svg?inline';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

export default {
  name: "DestinationBox",
  components: {
    AppStars,
    ShareThis,
    IconPin,
    IconHeart,
    IconHeartFilled,
    IconShare,
    IconSad,
    IconAdd,
    IconStar,
  },

  props: {
    title: String,
    rating: Number,
    ratingCount: {
      type: Number,
      default: 0
    },
    address: String,
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
    isLiked: Boolean,
    isShare: Boolean,
    isAddable: Boolean,
    type: {
      type: String, // type of display this box, rely on design, has following opts: 'box', 'no-box'
      default: 'box'
    },
    hasActions: {
      type: Boolean,
      default: true
    },
    hasPrice: Boolean,
    price: [Number, String],
    priceStrike: [Number, String],
    priceRed: [Number, String],
    showInfo: {
      type: Boolean,
      default: true
    },
    product_type: [String, Number],
    product_id: [String, Number],
    disabled: Boolean,
    status: {
      type: Number
    },
    disabledText: {
      type: String,
      default: 'hotel.not_working'
    },
    hasLevel: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated']),

    classes() {
      return {
        'destination-box--square': this.square,
        'destination-box--no-box': this.type === 'no-box',
        'destination-box--has-close': this.hasClose,
        'destination-box--has-price': this.hasPrice,
        'destination-box--not-active': this.status !== PRODUCT_STATUS.ACTIVE
      };
    }
  },

  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
    this.favorite = this.isLiked;
  },

  data() {
    return {
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      favorite: this.isLiked,
      loading: false,
      openShareThis: false,
      modalSignIn: false,
      confirmDelete: false
    };
  },

  watch: {
    isLiked: {
      immediate: true,
      handler(value) {
        this.favorite = value;
      }
    }
  },

  methods: {
    ...mapActions('favorite/favorite', ['postFavorite']),
    ...mapActions('tour/tour', ['postAddCompare']),
    ...mapActions('compare/compare', ['postCompareRemove']),
    toDetail(to) {
      this.$router.push(to);
    },
    async handelFavorite(isLike) {
      if (this.isAuthenticated) {
        console.log('handelFavorite', isLike, this.loading)

        if (this.loading) return;
        this.loading = true;

        const params = {
          id: this.product_id,
          type: this.product_type,
          isFavorite: isLike
        };
        const res = await this.postFavorite(params);

        if (res.code === RES_STATUS_SUCCESS) {
          this.$toast.global.primary(
            isLike
              ? this.$t('home.delete') +
                  ' ' +
                  this.$t('home.from_list_favourite')
              : this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
          );
          this.favorite = !this.favorite;
          this.$emit("success")
        } else {
          if (res.code === 999) {
            this.loading = false;
            this.handelFavorite(!isLike)
          } else {
            this.$toast.error(res.message);
          }
        }
        this.loading = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },

    async handleAddToList() {
      if (this.isAuthenticated) {
        if (this.loading) return;
        this.loading = true;

        const result = await this.postAddCompare({
          productId: this.product_id,
          productType: this.product_type
        });
        if (result.code === RES_STATUS_SUCCESS) {
          this.$toast.global.primary(
            this.$t('home.save') + ' ' + this.$t('home.to_list_compare')
          );
        } else if (result.code === 1038) {
          this.$toasted.error(result.message);
        } else if (result.code === 1039) {
          this.confirmDelete = true;
        }
        this.loading = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },
    async changeDelete() {
      if (this.isAuthenticated) {
        const result = await this.postCompareRemove({});
        if (result.code !== RES_STATUS_SUCCESS) {
          this.$toasted.error(result.message);
        } else {
          this.$toast.global.primary(
            this.$t('home.delete') +
              ' ' +
              this.$t('comparison.delete_comparison')
          );
          this.confirmDelete = false;
          const addProduct = await this.postAddCompare({
            productId: this.product_id,
            productType: this.product_type
          });
          if (addProduct.code === RES_STATUS_SUCCESS) {
            this.$toast.global.primary(
              this.$t('home.save') + ' ' + this.$t('home.to_list_compare')
            );
          } else {
            this.$toasted.error(addProduct.message);
          }
        }
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
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
@import '~/assets/scss/components/pages/common/_destination-box.scss';
</style>
