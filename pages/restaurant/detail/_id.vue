<template>
  <div class="container py-24">
    <client-only>
      <OverviewImg
        class="mb-24"
        :title="get(restaurantDetail, 'name', '')"
        :address="get(restaurantDetail, 'address', '')"
        :images="get(restaurantDetail, 'gallery', [])"
        :isFavorite="!!favorite"
        :btnBookingLink="`/${defaultLangCode}/booking/restaurant/review`"
        :shareLink="
          `/${defaultLangCode}/restaurant/` +
          $route.params.category_id +
          '/detail/' +
          get(restaurantDetail, 'restaurant_id', '')
        "
        btnBookingText="Đặt bàn"
        :status="get(restaurantDetail, 'status', 0)"
        :product-type="PRODUCT_TYPE.RESTAURANT"
        @favorite="(e) => handelFavorite(e)"
      >
        <template slot="booking">
          <v-button
            class="overview-img__btn-booking"
            variant="primary"
            to
            @click.prevent="() => handleScroll('order-now')"
            >{{ $t('restaurant.booking') }}</v-button
          >
        </template>
      </OverviewImg>
      <div class="sticky-container">
        <RestaurantTab />
        <div class="overview">
          <TabOverviewRestaurant />
          <OrderNow :disabled="get(restaurantDetail, 'status', 0) != 1" />
          <Introduction :data="introRestaurant" />
          <ServiceAndUtility :data="get(restaurantDetail, 'services', [])" />
        </div>
        <Menu :menu="get(restaurantDetail, 'menu', '')" />
        <LocalAround
          v-if="loaded"
          :showTab="get(restaurantDetail, 'enable_map', false)"
          :type="type"
          :data="get(restaurantDetail, 'location_around', [])"
          :center="{
            lat: get(restaurantDetail, 'lat', 0),
            lon: get(restaurantDetail, 'lon', 0)
          }"
        />

        <Feedback
          v-if="get(restaurantDetail, 'enable_rating', false)"
          id="review"
          class="mb-24"
          :rating="get(restaurantDetail, 'rating', {})"
          :comments="get(restaurantComments, 'data', [])"
          :product_type="type"
        >
          <template
            v-if="get(restaurantComments, 'pageable', []).total_page > 1"
            v-slot:load-more
          >
            <div class="feedback__more text-center">
              <v-button
                @click="onClickLoading"
                variant="outline-secondary"
                outline
              >
                {{
                  enableBtnLoadMore
                    ? $t('hotel.view_more')
                    : $t('restaurant.collapse')
                }}</v-button
              >
            </div>
          </template>
        </Feedback>
        <IsCare
          :data="restaurantRelated"
          v-if="get(restaurantDetail, 'enable_suggestion', false)"
        >
          <template slot="slider-items">
            <DestinationBox
              v-for="(item, index) in filterRestaurantRelated"
              :key="index"
              class="mb-5 swiper-slide"
              type="box"
              :img-attrs="{
                src: item.product_thumbnail_url,
                alt: item.name
              }"
              isShare
              hasPrice
              :hasActions="false"
              :price="item.from_price"
              :priceRed="item.discount"
              :to="item.link"
              :title="item.name"
              :rating="item.rate"
              :ratingCount="item.number_of_rate"
              :isLiked="!!item.is_favorite"
              :address="item.address"
              :product_type="item.product_type"
              :product_id="item.id"
              :status="item.status"
            >
              <div slot="price" v-if="item.from_price">
                {{ $t('hotel.form') }}
                <span class="color-primary">
                  {{
                    item.from_price
                      | priceTransform(currentExchangeRate)
                      | numeralFormat
                  }}
                  {{ currentUnitCode }}</span
                >/ {{ renderTextPricde(item.product_type) }}
              </div>
            </DestinationBox>
          </template>
          <template slot="title">
            <h5 class="deep-dark">{{ $t('hotel.maybe_interested') }}</h5>
          </template>
        </IsCare>
      </div>
    </client-only>
  </div>
</template>

<script>
import OverviewImg from '~/components/pages/common/OverviewImg';
import RestaurantTab from '~/components/pages/restaurant/RestaurantTab';
import OrderNow from '~/components/pages/restaurant/OrderNow';
import TabOverviewRestaurant from '~/components/pages/restaurant/TabOverviewRestaurant';
import Introduction from '~/components/pages/common/Introduction';
import ServiceAndUtility from '~/components/pages/common/ServiceAndUtility';
import Menu from '~/components/pages/restaurant/Menu';
import LocalAround from '~/components/pages/common/LocalAround';
import Feedback from '~/components/pages/common/Feedback';
import IsCare from '~/components/pages/common/IsCare';
import { PRODUCT_TYPE, COMMENTS, PRODUCT_STATUS } from '~/utils/constants';

import { mapActions, mapGetters, mapState } from 'vuex';
import { get } from 'lodash';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

const STORE_NAMESPACE = 'restaurant/restaurant';

export default {
  components: {
    OverviewImg,
    RestaurantTab,
    OrderNow,
    Introduction,
    ServiceAndUtility,
    Menu,
    LocalAround,
    Feedback,
    IsCare,
    TabOverviewRestaurant
  },

  async fetch() {
    const { id, category_id } = this.$route.params;
    await Promise.all([
      this.getRestaurantDetail({
        restaurant_id: id,
        category_id
      }),
      this.getRestaurantRelated({
        restaurant_id: id
      }),
      this.getRestaurantComment({
        restaurant_id: id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: 1
      })
    ]);
    this.loaded = true;
  },

  computed: {
    ...mapState(STORE_NAMESPACE, {
      restaurantComments: 'restaurant_comments'
    }),
    ...mapGetters('auth/auth', ['isAuthenticated']),

    ...mapGetters(STORE_NAMESPACE, ['restaurantDetail', 'restaurantRelated']),

    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),

    introRestaurant() {
      return {
        title: this.$t('hotel.introduction'),
        intro: '',
        content: get(this, 'restaurantDetail.general_introduction', '')
      };
    },
    filterRestaurantRelated() {
      const data = this.restaurantRelated.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    enableBtnLoadMore() {
      const pageable = get(this.restaurantComments, 'pageable', {});

      return pageable.total_page > this.page_index;
    },

    favorite() {
      return get(this, 'restaurantDetail.is_favorite', false);
    },
  },

  data() {
    return {
      loaded: false,
      loadingFavorite: false,
      type: PRODUCT_TYPE.RESTAURANT,
      page_index: 1,
      PRODUCT_TYPE,
      COMMENTS
    };
  },

  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  },

  methods: {
    get,
    ...mapActions(STORE_NAMESPACE, [
      'getRestaurantDetail',
      'getRestaurantComment',
      'getRestaurantRelated'
    ]),
    ...mapActions('favorite/favorite', ['postFavorite']),

    renderLink(value, id) {
      const { category_id } = this.$route.params;
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return `/${this.defaultLangCode}/hotel/detail/${id}`;
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return `/${this.defaultLangCode}/restaurant/detail/${id}`;
          break;
        case PRODUCT_TYPE.TOUR:
          return `/${this.defaultLangCode}/tour/detail/${id}`;
          break;

        case PRODUCT_TYPE.PRODUCT:
          return `/${this.defaultLangCode}/product-travel/detail/${id}`;
          break;
        case PRODUCT_TYPE.POST:
          return `/${this.defaultLangCode}/news/detail/${id}`;
          break;
        default:
          break;
      }
    },

    renderTextPricde(value) {
      switch (value) {
        case PRODUCT_TYPE.HOTEL:
          return this.$t('hotel.night');
          break;
        case PRODUCT_TYPE.RESTAURANT:
          return this.$t('hotel.people');
          break;
        case PRODUCT_TYPE.TOUR:
          return this.$t('hotel.people');
          break;
        case PRODUCT_TYPE.PRODUCT:
          return this.$t('product.index');
          break;
        default:
          break;
      }
    },

    async handelFavorite(e) {
      if (!this.isAuthenticated) {
        this.$toast.error(this.$t('home.not_login'));
        return;
      }
      if (!this.loadingFavorite) {
        this.loadingFavorite = true;
        const params = {
          id: get(this.$route, 'params.id', ''),
          type: 2,
          isFavorite: e
        };
        const res = await this.postFavorite(params);
        if (res.code === RES_STATUS_SUCCESS) {
          // this.favorite = !this.favorite;
          const { id, category_id } = this.$route.params;
          this.getRestaurantDetail({
            restaurant_id: id,
            category_id
          }),
            this.$toast.global.primary(
              !this.favorite
                ? this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
                : this.$t('home.delete') +
                    ' ' +
                    this.$t('home.from_list_favourite')
            );
        } else {
          this.$toast.error(res.message);
        }
        this.loadingFavorite = false;
      }
    },

    handleScroll(el) {
      const height =
        document.getElementsByClassName('restaurant-tab') &&
        document.getElementsByClassName('restaurant-tab').length > 0 &&
        document.getElementsByClassName('restaurant-tab')[0].offsetHeight;
      const element = document.getElementsByClassName(el)[0];
      window.scrollTo(0, element.offsetTop - height - 88);
    },

    onClickLoading() {
      this.page_index = this.enableBtnLoadMore ? this.page_index + 1 : 1;
      this.getRestaurantComment({
        restaurant_id: this.$route.params.id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: this.page_index
      });
    }
  }
};
</script>

<style></style>
