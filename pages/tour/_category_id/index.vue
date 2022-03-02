<template>
  <div class="tour">
    <BannerPages :img="getProductCategory" :summary="getProductLang" />

    <SearchForm @showmap="(e) => (googleMap = e)" @search="handleSearchTour" />

    <div class="container">
      <SimplePortal container="#portal-target" :disabled="!googleMap">
        <div class="row">
          <div
            class="col-6"
            v-for="tour in tourList"
            :class="[
              'mb-24 animated fadeIn',
              !googleMap ? 'col-md-4' : 'col-md-6'
            ]"
            :key="tour.tour_id"
          >
            <TourBox
              :img-attrs="{
                src: tour.avatar,
                alt: tour.name
              }"
              hasBtnShare
              :isAddable="true"
              :title="tour.name"
              :rating="tour.rate"
              :ratingCount="tour.number_of_rate"
              :start="tour.start_place"
              :destination-count="tour.number_of_destinations"
              :duration-day="tour.number_day"
              :duration-night="tour.number_night"
              :to="`/${defaultLangCode}/tour/detail/${tour.tour_id}`"
              :is-liked="!!tour.is_favorite"
              :status="tour.status"
              has-price
              square
              @like="() => handleLikeTour(tour.tour_id, tour.is_favorite)"
              @add="() => handleAddTour(tour.tour_id)"
            >
              <!--prettyhtml-ignore-->
              <!-- prettier-ignore -->
              <b slot="price">{{$t("hotel.form")}} <b class="primary"
                  >{{ tour.from_price | priceTransform(currentExchangeRate) | numeralFormat
                  }} {{ currentUnitCode }}</b
                > / {{$t("hotel.people")}}</b
              >
            </TourBox>
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
                  {{ $t('tour.compare_not_same') }}
                </h3>
              </div>
            </v-modal>
          </div>
        </div>

        <NotFound
          v-if="!$fetchState.pending && !tourList.length"
          class="animated fadeIn"
        />
      </SimplePortal>
    </div>

    <div class="container" v-show="googleMap">
      <div class="row">
        <div class="col-md-8" id="portal-target"></div>
        <div class="col-md-4">
          <!-- <GoogleMaps v-if="!loading" :markers="tourList" :type="type" @getmap="e => handleGetMap(e)"/> -->
        </div>
      </div>
    </div>
    
    <div class="container">
      <AppPagination :pageable="tourPagination" :v-if="!$fetchState.pending" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

import { camelCaseToSnakeCase } from '~/utils/common';
import { PRODUCT_TYPE, PAGER } from '~/utils/constants';
import { FAVORITE_ADD, FAVORITE_REMOVE } from '~/utils/endpoints';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import * as tourActionTypes from '~/utils/action-type/tour';

import { SimplePortal } from '~/utils/simple-portal';
import BannerPages from '~/components/pages/common/BannerPages';
import SearchForm from '~/components/pages/tour/TourSearchForm';
import TourBox from '~/components/pages/common/TourBox';
import AppPagination from '~/components/app/AppPagination';
import NotFound from '~/components/pages/common/NotFound';
import ShareThis from '~/components/pages/common/ShareThis';

import { convertSearchPayload } from '~/utils/common';

export default {
  components: {
    SimplePortal,
    BannerPages,
    SearchForm,
    TourBox,
    AppPagination,
    NotFound,
    ShareThis
  },

  data() {
    return {
      googleMap: false,
      map: {
        lat: '21.022704',
        lon: '105.767306',
        cid: '9524178702461917692'
      },
      type: PRODUCT_TYPE.TOUR,
      confirmDelete: false
    };
  },

  async fetch() {
    const { category_id } = this.$route.params;
    await Promise.all([
      this.getUtilitiesArea(),
      this.getUtilitiesProvince(),
      this.getUtilitiesTourType(),
      this.getUtilitiesTourTime(),
      this.getTourList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        category_id,
        ...this.$route.query
      }),
      this.getHomeProductCategory({ product_category_id: PRODUCT_TYPE.TOUR }),
      this.getUtilitiesSortingCriteria()
    ]);
  },

  computed: {
    ...mapState('common/common', ['defaultCurrency', 'defaultLang']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    ...mapGetters('tour/tour', ['tourList', 'tourPagination']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('home/home', ['getProductCategory', 'getProductLang'])
  },

  watch: {
    '$route.query': function (newValue) {
      this.getTourListWithCategory();
      this.$scrollTo('#container-common-search-form');
    }
    // defaultLang(_newVal) {
    //   const { category_id } = this.$route.params;
    //   this.getHomeProductCategory({ product_category_id: category_id });
    //   this.getTourListWithCategory();
    // }
  },

  methods: {
    ...mapActions('common/selectbox', [
      'getUtilitiesArea',
      'getUtilitiesProvince',
      'getUtilitiesTourType',
      'getUtilitiesTourTime'
    ]),
    ...mapActions('tour/tour', [
      'getTourList',
      'postTourFavorite',
      'postAddCompare'
    ]),
    ...mapActions('compare/compare', ['postCompareRemove']),

    ...mapActions('home/home', ['getHomeProductCategory']),

    ...mapActions('common/common', ['getUtilitiesSortingCriteria']),

    handleGetMap(e) {},

    handleSearchTour(data = {}) {
      const { category_id } = this.$route.params;
      let payload = convertSearchPayload(data);

      this.$router.push({
        path: this.$route.path,
        query: payload
      });
    },

    async handleLikeTour(tourId, isLike) {
      if (this.isAuthenticated) {
        const doLike = await this.postTourFavorite({
          type: PRODUCT_TYPE.TOUR,
          id: tourId,
          isFavorite: isLike ? 0 : 1
        });

        this.$toast.global.primary(
          isLike
            ? this.$t('home.delete') + ' ' + this.$t('home.from_list_favourite')
            : this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
        );
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },

    async handleAddTour(tourId) {
      if (this.isAuthenticated) {
        const result = await this.postAddCompare({
          productId: tourId,
          productType: 3
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
          this.postAddCompare({
            productId: this.product_id,
            productType: this.product_type
          }).then((result) => {
            if (result.code !== RES_STATUS_SUCCESS) {
              this.$toast.global.primary(
                this.$t('home.save') + ' ' + this.$t('home.to_list_compare')
              );
            } else {
              this.$toasted.error(result.message);
            }
          });
        }
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },
    async getTourListWithCategory() {
      const { category_id } = this.$route.params;
      return await this.getTourList({
        page_index: PAGER.PAGE_INDEX,
        page_size: PAGER.PAGE_SIZE,
        currency: this.defaultCurrency.id,
        category_id,
        ...this.$route.query
      });
    }
  }
};
</script>
