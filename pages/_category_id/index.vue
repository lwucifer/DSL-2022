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
      <BoxWrapper v-if="combo.items && combo.items.length > 0">
        <template v-slot:title
          ><h4 class="mb-0">{{ combo.combo_title }}</h4></template
        >
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
          <n-link :to="`/${defaultLangCode}/hotel/${$route.params.category_id}`" class="secondary heading-5">{{
            $t('home.view_more')
          }}</n-link>
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
          <n-link :to="`/${defaultLangCode}/restaurant/${$route.params.category_id}`" class="secondary heading-5">{{
            $t('home.view_more')
          }}</n-link>
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
          <n-link :to="`/${defaultLangCode}/tour/${$route.params.category_id}`" class="secondary heading-5">{{
            $t('home.view_more')
          }}</n-link>
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
          <EasyTravel :thumbnail="video.video_thumbnail" />
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

import { mapActions, mapState, mapGetters } from 'vuex';
import { convertSearchPayload } from '~/utils/common';
import { TIME_SHOW_POPUP } from '~/utils/constants';
import Cookies from 'js-cookie';

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
    PopupNewsletter
  },

  data() {
    return {
      confirmPopup: false,
      isShowNewsletter: true
    };
  },

  mounted() {
    if (Cookies.get('isCloseNewsletter')) {
      this.isShowNewsletter = !JSON.parse(Cookies.get('isCloseNewsletter'));
    }
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
      'getSliderBanner'
    ]),

    handleSearchHotel(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/hotel`,
        query: payload,
        category_id: this.$route.params.category_id
      });
    },
    handleSearchTour(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/tour`,
        query: payload,
        category_id: this.$route.params.category_id
      });
    },
    handleSearchRestaurant(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/restaurant`,
        query: payload,
        category_id: this.$route.params.category_id
      });
    },
    handleSearchProductTravel(data = {}) {
      let payload = convertSearchPayload(data);
      this.$router.push({
        path: `/product-travel`,
        query: payload,
        category_id: this.$route.params.category_id
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
    ...mapState('common/common', ['defaultCurrency', 'defaultLang', 'defaultLangCode']),
    ...mapGetters('auth/auth', ['isAuthenticated'])
  },

  async fetch() {
    const { category_id } = this.$route.params;
    await Promise.all([
      this.getSliderBanner({ category_id }),
      this.getHomeCombo({ category_id }),
      this.getHomeHotel({ category_id }),
      this.getUtilitiesDishType(),
      this.getUtilitiesProvince(),
      this.getUtilitiesArea(),
      this.getHomeRestaurant({ category_id }),
      this.getHomeTour({ category_id }),
      this.getHomeVideo({ category_id })
    ]);
  },

  watch: {
    // defaultLang(_newVal) {
    //   this.getSliderBanner({ category_id });
    //   this.getHomeCombo({ category_id });
    //   this.getHomeHotel({ category_id });
    //   this.getUtilitiesDishType();
    //   this.getUtilitiesArea();
    //   this.getUtilitiesProvince(), this.getHomeRestaurant({ category_id });
    //   this.getHomeTour({ category_id });
    //   this.getHomeVideo({ category_id });
    // }
  }
};
</script>
