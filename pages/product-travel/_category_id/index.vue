<template>
  <div class="product-travel">
    <BannerPages :img="getProductCategory" :summary="getProductLang" />

    <SearchForm @showmap="(e) => (googleMap = e)" @search="handleSearch" />

    <div class="container">
      <SimplePortal container="#portal-target" :disabled="!googleMap">
        <div class="animated fadeIn">
          <div class="row">
            <div
              v-for="product in productTravelList"
              class="col-6 col-md-4 mb-24"
              :class="googleMap ? 'col-xl-6' : 'col-xl-4'"
              :key="product.id"
              @mouseover="activeItem = product"
              @mouseout="activeItem = {}"
            >
              <DestinationBox
                :img-attrs="{
                  src: product.thumbnail ? product.thumbnail : product.default_thumbnail,
                  alt: product.productName ? product.productName : product.name
                }"
                isShare
                isAddable
                :title="product.productName ? product.productName : product.name"
                :rating="product.rateScore"
                :ratingCount="product.rateNumber"
                :to="`/${defaultLangCode}/product-travel/detail/${product.id}`"
                :is-liked="!!product.is_favorite"
                :status="+product.status"
                :product_id="product.id"
                :product_type="PRODUCT_TYPE.PRODUCT"
                has-price
                square
              >
                <!--prettyhtml-ignore-->
                <!-- prettier-ignore -->
                <b slot="price"><b class="primary"
                >{{ product.price | priceTransform(currentExchangeRate) | numeralFormat
                  }} </b>{{ currentUnitCode }} / {{$t('product.index')}}</b>
              </DestinationBox>
            </div>
          </div>

          <NotFound
            v-if="!$fetchState.pending && !productTravelList.length"
            class="animated fadeIn"
          />
        </div>
      </SimplePortal>
    </div>

    <div v-show="googleMap" class="container" sticky-container>
      <div class="row">
        <div class="col-xl-4 mb-24 order-xl-2">
          <GoogleMaps
            v-if="showMap"
            v-sticky="shouldStick"
            :sticky-offset="`{ top: ${stickyOffsetTop}, bottom: ${stickyOffsetBottom} }`"
            :bottom="true"
            :markers="productTravelList"
            :type="PRODUCT_TYPE.PRODUCT"
            :activeProp="activeItem"
            :height="mapHeight"
			:loading="loading"
            @getmap="(e) => handleGetMap(e)"
          />
        </div>
        <div class="col-xl-8 order-xl-1" id="portal-target"></div>
      </div>
    </div>

    <div class="container">
      <AppPagination
        :pageable="productTravelPagination"
        :v-if="!$fetchState.pending"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import { camelCaseToSnakeCase } from '~/utils/common';
import { PRODUCT_TYPE, PAGER, MENU_PAGE_TYPE } from '~/utils/constants';
import { FAVORITE_ADD, FAVORITE_REMOVE } from '~/utils/endpoints';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import * as tourActionTypes from '~/utils/action-type/tour';

import { SimplePortal } from '~/utils/simple-portal';
import BannerPages from '~/components/pages/common/BannerPages';
import SearchForm from '~/components/pages/product-travel/ProductSearchForm';
import DestinationBox from '~/components/pages/common/DestinationBox';
import AppPagination from '~/components/app/AppPagination';
import NotFound from '~/components/pages/common/NotFound';
import GoogleMaps from '~/components/pages/common/GoogleMaps';

import { convertSearchPayload } from '~/utils/common';
import { triggerEvent } from '~/utils/dom';
import { get } from 'lodash';

export default {
  components: {
    SimplePortal,
    BannerPages,
    SearchForm,
    DestinationBox,
    AppPagination,
    NotFound,
    GoogleMaps
  },

  data() {
    return {
      googleMap: false,
      map: {
        lat: '21.022704',
        lon: '105.767306',
        cid: '9524178702461917692'
      },
      loading: false,
      loaded: false,
      loadingMap: false,
      searchByMap: false,
      type: PRODUCT_TYPE.PRODUCT,
      activeItem: {},
      showMap: true,
      stickyOffsetTop: 136,
      stickyOffsetBottom: 30,
      shouldStick: false,
      mapHeight: 375
    };
  },

  async fetch() {
    const { category_id } = this.$route.params;
    const productMenuItem = this.menuConfig.find(
      (item) => item.page_type === MENU_PAGE_TYPE.PRODUCT
    );

    this.loading = true;

    await Promise.all([
      this.getProductTravelList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      }),
      this.getHomeProductCategory({
        product_category_id: PRODUCT_TYPE.PRODUCT
      }),
      this.getUtilitiesSortingCriteria(),
      productMenuItem &&
        this.getHomeTourismProductCategory({
          category_id: productMenuItem.page_id
        })
    ]);

    this.loading = false;
  },

  computed: {
    ...mapState('common/common', [
      'defaultCurrency',
      'defaultLang',
      'menuConfig'
    ]),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    ...mapGetters('productTravel/productTravel', [
      'productTravelList',
      'productTravelPagination'
    ]),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('home/home', ['getProductCategory', 'getProductLang'])
  },

  created() {
    this.PRODUCT_TYPE = Object.freeze(PRODUCT_TYPE);
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },

  watch: {
    '$route.query': function (newValue) {
      this.getProductListWithCategory();
      this.$scrollTo('#container-common-search-form');
    },

    searchByMap(_newVal) {
      if (!_newVal) this.getProductListWithCategory();
    },

    stickyOffsetTop: {
      immediate: true,
      handler(newValue) {
        if (this.shouldStick) {
          this.showMap = false;
          this.$nextTick(() => {
            this.showMap = true;
          });
        }
      }
    },

    shouldStick: {
      immediate: true,
      handler(newValue) {
        this.showMap = false;
        this.$nextTick(() => {
          this.showMap = true;
        });
      }
    },

    googleMap(newValue) {
      if (newValue) {
        this.showMap = false;
        this.$nextTick(() => {
          this.showMap = true;

          this.$nextTick(() => {
            triggerEvent(window, 'resize')
          })
        })
      } else {
        this.getProductListWithCategory();
      }
    }
  },

  methods: {
    ...mapActions('productTravel/productTravel', [
      'getProductTravelList',
      'getAroundLocationProductTravel'
    ]),
    ...mapActions('home/home', [
      'getHomeProductCategory',
      'getHomeTourismProductCategory'
    ]),
    ...mapActions('common/common', ['getUtilitiesSortingCriteria']),
    ...mapActions('restaurant/restaurant', ['getAroundLocationRestaurant']),
    ...mapActions('hotel/hotel', ['getAroundLocationHotel']),

    handleSearch(data = {}) {
      const { category_id } = this.$route.params;
      let payload = convertSearchPayload(data);

      this.$router.push({
        path: this.$route.path,
        query: payload
      });
    },

    async getProductListWithCategory() {
	  if (this.loading) return false;
      this.loading = true;
      const { category_id } = this.$route.params;
      this.getProductTravelList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      });
      this.loading = false;
    },

    async handleGetMap(current) {
      if (this.loading) return false;
      this.loading = true;

      let lat = get(current, 'lat', 0);
      let lon = get(current, 'lon', 0);
      let distance = get(current, 'distance', 1100);

      let params = { lat: lat, lon: lon, distance: distance, ...this.$route.query };

      if (get(current, 'type', '') == PRODUCT_TYPE.RESTAURANT) {
        this.type = PRODUCT_TYPE.RESTAURANT;
        await this.getAroundLocationRestaurant(params);
      } else if (get(current, 'type', '') == PRODUCT_TYPE.HOTEL) {
        this.type = PRODUCT_TYPE.HOTEL;
        await this.getAroundLocationHotel(params);
      } else if (get(current, 'type', '') == PRODUCT_TYPE.PRODUCT) {
        this.type = PRODUCT_TYPE.PRODUCT;
        await this.getAroundLocationProductTravel(params);
      } else {
        this.type = '';
        await this.getAroundLocationProductTravel({ ...params, distance: -1 });
      }

      this.searchByMap = true;
      this.loading = false;
    },

    handleWindowResize() {
      if (window.innerWidth >= 1440) {
        this.stickyOffsetTop = 80 + 108 + 30;
        this.stickyOffsetBottom = 30;
        this.shouldStick = true;
        this.mapHeight = 900;
      } else if (window.innerWidth >= 1248) {
        this.stickyOffsetTop = 64 + 87 + 24;
        this.stickyOffsetBottom = 24;
        this.shouldStick = true;
        this.mapHeight = 450;
      } else {
        this.shouldStick = false;
        this.mapHeight = 375;
      }
    }
  }
};
</script>
