<template>
  <div id="home">
    <SliderBanner :banners="slider" />
    <SearchForm
      @searchHotel="handleSearchHotel"
      @searchTour="handleSearchTour"
      @searchRestaurant="handleSearchRestaurant"
      @searchProductTravel="handleSearchProductTravel"
    />

    <div class="container">
      <BoxWrapper v-if="combo.items && combo.items.length > 0" :isNavigation="true">
        <template v-slot:title>
          <h4 class="mb-0">{{ combo.combo_title }}</h4>
        </template>

        <template v-slot:text
          >&#62; {{ combo.combo_description }} &#60;</template
        >
        <template v-slot:content>
          <CouponCombo :data="combo.items" />
        </template>
      </BoxWrapper>

      <BoxWrapper v-if="hotel.items && hotel.items.length > 0">
        <template v-slot:title
          ><h4 class="mb-0">{{ hotel.hotel_title }}</h4></template
        >
        <template v-slot:view-more>
          <n-link
            :to="`/${defaultLangCode}/hotel/${menuMappingObj['hotel']}`"
            class="secondary heading-5"
            >{{ $t('home.view_more') }}</n-link
          >
        </template>
        <template v-slot:text
          >&#62; {{ hotel.hotel_description }} &#60;</template
        >
        <template v-slot:content>
          <HotelFavourite :data="hotel.items" @reload="getHomeHotel" />
        </template>
      </BoxWrapper>

      <BoxWrapper v-if="restaurant.items && restaurant.items.length > 0">
        <template v-slot:title
          ><h4 class="mb-0">{{ restaurant.restaurant_title }}</h4></template
        >
        <template v-slot:view-more>
          <n-link
            :to="`/${defaultLangCode}/restaurant/${menuMappingObj['restaurant']}`"
            class="secondary heading-5"
            >{{ $t('home.view_more') }}</n-link
          >
        </template>
        <template v-slot:text
          >&#62; {{ restaurant.restaurant_description }} &#60;</template
        >
        <template v-slot:content>
          <RestaurantFavourite
            :data="restaurant.items"
            @reload="getHomeRestaurant"
          />
        </template>
      </BoxWrapper>

      <BoxWrapper v-if="tour.items && tour.items.length > 0">
        <template v-slot:title
          ><h4 class="mb-0">{{ tour.tour_title }}</h4></template
        >
        <template v-slot:view-more>
          <n-link
            :to="`/${defaultLangCode}/tour/${menuMappingObj['tour']}`"
            class="secondary heading-5"
            >{{ $t('home.view_more') }}</n-link
          >
        </template>
        <template v-slot:text>&#62; {{ tour.tour_description }} &#60;</template>
        <template v-slot:content>
          <TourFavourite :data="tour.items" @reload="getHomeTour" />
        </template>
      </BoxWrapper>

      <BoxWrapper v-if="video.video_url && video.video_url.length > 0">
        <template v-slot:title
          ><h4 class="mb-0">{{ video.video_title }}</h4></template
        >
        <template v-slot:text
          >&#62; {{ video.video_description }} &#60;</template
        >
        <template v-slot:content>
          <EasyTravel />
        </template>
      </BoxWrapper>
    </div>

    <PopupNewsletter v-if="isShowNewsletter" />
  </div>
</template>

<script>
import SliderBanner from '~/components/pages/common/SliderBanner';
import BoxWrapper from '~/components/pages/home/BoxWrapper';
import CouponCombo from '~/components/pages/home/CouponCombo';
import HotelFavourite from '~/components/pages/home/HotelFavourite';
import RestaurantFavourite from '~/components/pages/home/RestaurantFavourite';
import TourFavourite from '~/components/pages/home/TourFavourite';
import EasyTravel from '~/components/pages/home/EasyTravel';
import SearchForm from '~/components/pages/common/SearchForm';
import PopupNewsletter from '~/components/pages/common/PopupNewsletter';
import IconNext from '~/assets/icons/next.svg?inline';
import IconPre from '~/assets/icons/pre.svg?inline';

import { mapActions, mapState, mapGetters } from 'vuex';
import { convertSearchPayload } from '~/utils/common';
import { TIME_SHOW_POPUP, MENU_PAGE_TYPE } from '~/utils/constants';
import Cookies from 'js-cookie';
import { cloneDeep } from 'lodash';

export default {
  components: {
    SliderBanner,
    BoxWrapper,
    CouponCombo,
    HotelFavourite,
    RestaurantFavourite,
    TourFavourite,
    EasyTravel,
    SearchForm,
    PopupNewsletter,
    IconNext,
    IconPre
  },

  data() {
    return {
      isShowNewsletter: true
    };
  },

  methods: {
    ...mapActions('common/common', ['getUtilitiesMenu']),

    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesProvince',
      'getUtilitiesDishType'
    ]),

    ...mapActions('home/home', [
      'getHomeCombo',
      'getHomeHotel',
      'getHomeRestaurant',
      'getHomeTour',
      'getHomeVideo',
      'getSliderBanner',
      'getHomeTourismProductCategory'
    ]),

    handleSearchHotel(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/${this.defaultLangCode}/hotel/${this.menuMappingObj['hotel']}`,
        query: payload
      });
    },
    handleSearchTour(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/${this.defaultLangCode}/tour/${this.menuMappingObj['tour']}`,
        query: payload
      });
    },
    handleSearchRestaurant(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/${this.defaultLangCode}/restaurant/${this.menuMappingObj['restaurant']}`,
        query: payload
      });
    },
    handleSearchProductTravel(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/${this.defaultLangCode}/product-travel/${this.menuMappingObj['product-travel']}`,
        query: payload
      });
    }
  },

  computed: {
    // ...mapState('restaurant/restaurant', ['slider']),
    ...mapState('home/home', [
      'slider',
      'combo',
      'hotel',
      'restaurant',
      'tour',
      'video'
    ]),
    ...mapState('common/common', [
      'defaultCurrency',
      'defaultLang',
      'menuConfig'
    ]),
    ...mapGetters('common/common', ['menuMappingObj', 'defaultLangCode']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
  },

  async fetch() {
    const { category_id } = this.$route.params;
    const productMenuItem = this.menuConfig.find(
      (item) => item.page_type === MENU_PAGE_TYPE.PRODUCT
    );

    await Promise.all([
      this.getSliderBanner(),
      this.getHomeCombo(),
      this.getHomeHotel(),
      this.getUtilitiesDishType(),
      this.getUtilitiesProvince(),
      this.getUtilitiesArea(),
      this.getHomeRestaurant(),
      this.getHomeTour(),
      this.getHomeVideo(),
      productMenuItem &&
        this.getHomeTourismProductCategory({
          category_id: productMenuItem.page_id
        })
    ]);
  },

  watch: {
  },

  mounted() {
    if (Cookies.get('isCloseNewsletter') && Cookies.get('isCloseNewsletter')) {
      this.isShowNewsletter = !JSON.parse(Cookies.get('isCloseNewsletter'));
    }
  }
};
</script>
