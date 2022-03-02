<template>
  <div class="product">
    <BannerPages :img="getProductCategory" :summary="getProductLang" />

    <SearchForm @showmap="(e) => (googleMap = e)" @search="handleSearchHotel" />

    <div class="container">
      <SimplePortal container="#portal-target" :disabled="!googleMap">
        <div class="animated fadeIn">
          <ListHotel
            :propType="type"
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
            :bottom="true"
            :markers="
              type == PRODUCT_TYPE.RESTAURANT ? restaurantList : hotelList
            "
            :type="type"
            :activeProp="activeItem"
            :height="mapHeight"
            @getmap="(e) => handleGetMap(e)"
          />
        </div>
        <div class="col-xl-8 order-xl-1" id="portal-target"></div>
      </div>
    </div>

    <div class="container animated fadeIn">
      <AppPagination
        v-if="!$fetchState.pending"
        :pageable="
          type == PRODUCT_TYPE.RESTAURANT
            ? restaurantPagination
            : hotelPagination
        "
      />
    </div>
  </div>
</template>

<script>
import { SimplePortal } from '~/utils/simple-portal';
import ListHotel from '~/components/pages/hotel/ListHotel.vue';
import BannerPages from '~/components/pages/common/BannerPages';
import SearchForm from '~/components/pages/hotel/HotelSearchForm';
import AppPagination from '~/components/app/AppPagination';
import GoogleMaps from '~/components/pages/common/GoogleMaps';
import { PAGER, PRODUCT_TYPE } from '~/utils/constants';

import { mapActions, mapGetters, mapState } from 'vuex';
import { triggerEvent } from '~/utils/dom';
import { convertSearchPayload } from '~/utils/common';
import { get, map } from 'lodash';

export default {
  components: {
    BannerPages,
    SearchForm,
    ListHotel,
    AppPagination,
    GoogleMaps,
    SimplePortal
  },

  data() {
    return {
      googleMap: false,
      loaded: false,
      loading: false,
      type: PRODUCT_TYPE.HOTEL,
      PRODUCT_TYPE,
      loadingMap: false,
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
      this.getUtilitiesProvince(),
      this.getUtilitiesRating(),
      this.getUtilitiesHotelType(),
      this.getHotelList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      }),
      this.getHomeProductCategory({ product_category_id: category_id }),
      this.getUtilitiesSortingCriteria()
    ]);
  },

  computed: {
    ...mapGetters('hotel/hotel', ['hotelPagination', 'hotelList']),
    ...mapGetters('restaurant/restaurant', [
      'restaurantPagination',
      'restaurantList'
    ]),

    ...mapState('common/common', ['defaultCurrency', 'defaultLang']),
    ...mapGetters('home/home', ['getProductCategory', 'getProductLang']),
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
      this.handleGetHotelList();
      this.$scrollTo("#container-common-search-form");
    },
    // defaultLang(_newVal) {
    //   const { category_id } = this.$route.params;
    //   this.getHomeProductCategory({ product_category_id: category_id });
    //   this.handleGetHotelList();
    // },
    searchByMap(_newVal) {
      if (!_newVal) this.handleGetHotelList();
    },
    
    stickyOffsetTop: {
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
        this.handleGetHotelList();
      }
    }
  },

  methods: {
    get,
    map,
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesProvince',
      'getUtilitiesRating',
      'getUtilitiesHotelType'
    ]),
    ...mapActions('hotel/hotel', ['getHotelList', 'getAroundLocationHotel']),
    ...mapActions('restaurant/restaurant', [
      'getRestaurantList',
      'getAroundLocationRestaurant'
    ]),
    ...mapActions('home/home', ['getHomeProductCategory']),

    ...mapActions('common/common', ['getUtilitiesSortingCriteria']),

    handleSearchHotel(data = {}) {
      this.searchByMap = false;
      this.type = PRODUCT_TYPE.HOTEL;
      let payload = convertSearchPayload(data);
      this.$router.push({ path: this.$route.path, query: payload });
    },

    async handleGetHotelList() {
      this.loading = true;
      const { category_id } = this.$route.params;
      await this.getHotelList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      });
      this.loaded = true;
      this.loading = false;
    },

    async handleGetMap(current) {
      if (this.loading) return false;

      this.loading = true;

      let lat = get(current, 'lat', false)
        ? get(current, 'lat', 0)
        : get(center, 'lat', 0);
      let lon = get(current, 'lon', false)
        ? get(current, 'lon', 0)
        : get(center, 'lon', 0);
		
      let distance = get(current, 'distance', 1100);

      let params = { lat: lat, lon: lon, distance: distance, ...this.$route.query };

      this.type = get(current, 'type', '');
      if (get(current, 'type', '') == PRODUCT_TYPE.RESTAURANT) {
        await this.getAroundLocationRestaurant(params);
      } else if (get(current, 'type', '') == PRODUCT_TYPE.HOTEL) {
        await this.getAroundLocationHotel(params);
      } else {
        await this.getAroundLocationHotel({ ...params, distance: -1 });
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
  },
};
</script>

<style></style>
