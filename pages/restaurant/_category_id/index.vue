<template>
  <div class="list-restaurant">
    <BannerPages :img="getProductCategory" :summary="getProductLang" />

    <SearchForm
      @showmap="(e) => (googleMap = e)"
      @search="handleSearch"
      class="sticky"
    />

    <!-- NEW -->
    <div class="container">
      <SimplePortal container="#portal-target" :disabled="!googleMap">
        <div class="animated fadeIn">
          <ListRestaurant
            :propType="type"
            :list="list"
            :loaded="!$fetchState.pending"
            :col="googleMap ? 6 : 4"
            @hover="
              (e) => {
                googleMap && (activeItem = e);
              }
            "
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
            :loading="loading"
            :bottom="true"
            :markers="list"
            :type="type"
            :activeProp="activeItem"
            :height="mapHeight"
            @getmap="(e) => handleGetMap(e)"
          />
        </div>
        <div class="col-xl-8 order-xl-1" id="portal-target"></div>
      </div>
    </div>

    <div class="container animated fadeIn" v-if="!searchByMap">
      <AppPagination :pageable="pagination" v-if="!$fetchState.pending" />
    </div>
  </div>
</template>

<script>
import { SimplePortal } from '~/utils/simple-portal';
import BannerPages from '~/components/pages/common/BannerPages';
import ListRestaurant from '~/components/pages/restaurant/ListRestaurant';
import SearchForm from '~/components/pages/restaurant/RestaurantSearchForm';
import GoogleMaps from '~/components/pages/common/GoogleMaps';
import AppPagination from '~/components/app/AppPagination';
import { PAGER, PRODUCT_TYPE } from '~/utils/constants';

import { mapActions, mapGetters, mapState } from 'vuex';
import { triggerEvent } from '~/utils/dom';
import { convertSearchPayload } from '~/utils/common';
import { flip } from '@popperjs/core';
import { get } from 'lodash';

const STORE_NAMESPACE = 'restaurant/restaurant';

export default {
  components: {
    BannerPages,
    ListRestaurant,
    SearchForm,
    GoogleMaps,
    AppPagination,
    SimplePortal
  },

  data() {
    return {
      googleMap: false,
      loadingSlider: false,
      loading: false,
      loaded: false,
      loadingMap: false,
      type: PRODUCT_TYPE.RESTAURANT,
      searchByMap: false,
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
    await Promise.all([
      this.getUtilitiesArea(),
      this.getUtilitiesDishType(),
      this.getUtilitiesRestaurantType(),
      this.getUtilitiesProvince(),
      this.getRestaurantList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      }),
      this.getHomeProductCategory({
        product_category_id: category_id
      }),
      this.getUtilitiesSortingCriteria()
    ]);
  },

  computed: {
    ...mapGetters(STORE_NAMESPACE, ['restaurantPagination', 'restaurantList']),
    ...mapGetters('hotel/hotel', ['hotelList', 'hotelPagination']),

    ...mapState('common/common', ['defaultCurrency', 'defaultLang']),
    ...mapGetters('home/home', ['getProductCategory', 'getProductLang']),

    list() {
      if (this.type == PRODUCT_TYPE.RESTAURANT) return this.restaurantList;
      if (this.type == PRODUCT_TYPE.HOTEL) return this.hotelList;
      return [];
    },

    pagination() {
      if (this.type == PRODUCT_TYPE.RESTAURANT)
        return this.restaurantPagination;
      if (this.type == PRODUCT_TYPE.HOTEL) return this.hotelPagination;
      return {};
    }
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
      this.handleGetRestaurantList();
      this.$scrollTo('#container-common-search-form');
    },
    
    searchByMap(_newVal) {
      if (!_newVal) this.handleGetRestaurantList();
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
        })
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
        this.handleGetRestaurantList();
      }
    }
  },

  methods: {
    get,
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesProvince',
      'getUtilitiesDishType',
      'getUtilitiesRestaurantType'
    ]),
    ...mapActions(STORE_NAMESPACE, [
      'getRestaurantList',
      'getAroundLocationRestaurant'
    ]),
    ...mapActions('hotel/hotel', ['getAroundLocationHotel']),

    ...mapActions('home/home', ['getHomeProductCategory']),

    ...mapActions('common/common', ['getUtilitiesSortingCriteria']),

    handleSearch(data) {
      this.searchByMap = false;
      this.type = PRODUCT_TYPE.RESTAURANT;
      let payload = convertSearchPayload({ ...data });
      this.$router.push({ path: this.$route.path, query: payload });
    },

    async handleGetRestaurantList() {
      const { category_id } = this.$route.params;
      this.loading = true;
      await this.getRestaurantList({
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
      } else {
        this.type = '';
        await this.getAroundLocationRestaurant({ ...params, distance: -1 });
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

<style></style>
