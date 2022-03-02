<template>
  <client-only>
    <v-modal
      :header="false"
      :footer="false"
      v-bind="{ ...$props, ...$attrs }"
      v-on="$listeners"
      modal-class="modal-search"
      @cancel="$emit('cancel')"
    >
      <!-- <span class="modal-auth-close" @click="$emit('cancel')">
        <span></span>
      </span> -->

      <div class="modal-search_form">
        <h3>{{$t("header.search_location")}}</h3>
        <div class="form_container justify-content-end">
          <!-- <div v-if="filterResult && keyword.length > 0" class="color-red">
            {{$t("header.no_result")}}
          </div>
          <div v-if="keyword.length === 0 && totalSearchCommon === 0">
            {{$t("header.please_input_key")}}
          </div>
          <div v-if="totalSearchCommon > 0" class="primary">
            {{ totalSearchCommon }} {{$t("header.seach_result")}}
          </div> -->
          <a
            href
            v-if="(filterResult && keyword.length > 0) || totalSearchCommon > 0"
            class="color-red"
            @click.prevent="resetKeyword"
          >
            {{$t("hotel.clear_filter")}}
          </a>
        </div>

        <div class="control">
          <v-input
            type="text"
            class="search__input"
            size="lg"
            :placeholder="$t('header.input_search')"
            v-model="keyword"
            @keyup.enter="handleSearch"
            @click="isSuggest = true"
          />

          <v-button
            type="button"
            size="lg"
            variant="primary"
            @click.prevent="handleSearch"
          >
            <div><IconSearch /></div>
          </v-button>
        </div>
      </div>

      <!-- <SuggestSearch
        :suggest="suggestion_most"
        :history="historyData"
        v-if="isSuggest"
        @append="appendSearch"
      /> -->

      <div class="modal-search_result">

        <h3>{{$t("header.recommended_you")}}</h3>

        <div class="recommended-tab">
          <span @click="tab = 1" :class="{'active': tab == 1}">{{ $t('home.hotel') }}</span>
          <span @click="tab = 2" :class="{'active': tab == 2}">{{ $t('header.restaurants') }}</span>
          <span @click="tab = 3" :class="{'active': tab == 3}">{{ $t('home.tour') }}</span>
          <span @click="tab = 4" :class="{'active': tab == 4}">{{ $t('home.product_travel') }}</span>
        </div>

        <!-- Tabs Khách sạn -->
        <div class="row" v-if="tab == 1">
          <div
            class="col-6 col-md-3"
            v-for="(item) in suggestionHotel.data"
            :key="item.hotel_id"
          >
            <DestinationBox
              type="no-box"
              :img-attrs="{
                src: item.thumbnail,
                alt: item.name
              }"
              :title="item.name"
              :isLiked="!!item.is_favorite"
              :to="`/${defaultLangCode}/hotel/detail/${item.hotel_id}`"
              :exact="true"
              :product_type="PRODUCT_TYPE.HOTEL"
              :product_id="item.hotel_id"
              :status="item.status"
              hasPrice
              :showInfo="false"
              @success="successLikeHotel"
            />
          </div>
        </div>

        <!-- Tabs Nhà hàng -->
        <div class="row" v-if="tab == 2">
          <div
            class="col-6 col-md-3"
            v-for="(item) in suggestionRestaurant.data"
            :key="item.restaurant_id"
          >
            <DestinationBox
              type="no-box"
              :img-attrs="{
                src: item.thumbnail,
                alt: item.name
              }"
              :title="item.name"
              :isLiked="!!item.is_favorite"
              :to="`/${defaultLangCode}/restaurant/detail/${item.restaurant_id}`"
              :exact="true"
              :product_id="item.restaurant_id"
              :product_type="PRODUCT_TYPE.RESTAURANT"
              :status="item.status"
              hasPrice
              :showInfo="false"
              @success="successLikeRestaurant"
            />
          </div>
        </div>

        <!-- Tabs Tour -->
        <div class="row" v-if="tab == 3">
          <div
            class="col-6 col-md-3"
            v-for="(item) in suggestionTour.data"
            :key="item.tour_id"
          >
            <DestinationBox
              type="no-box"
              :img-attrs="{
                src: item.thumbnail,
                alt: item.name
              }"
              :title="item.name"
              :isLiked="!!item.is_favorite"
              :to="`/${defaultLangCode}/tour/detail/${item.tour_id}`"
              :exact="true"
              :product_id="item.tour_id"
              :product_type="PRODUCT_TYPE.TOUR"
              :status="item.status"
              hasPrice
              :showInfo="false"
              @success="successLikeTour"
            />
          </div>
        </div>

        <!-- Tabs Travel -->
        <div class="row" v-if="tab == 4">
          <div
            class="col-6 col-md-3"
            v-for="(item) in suggestionTravel.data"
            :key="item.id"
          >
            <DestinationBox
              type="no-box"
              :img-attrs="{
                src: item.thumbnail,
                alt: item.name
              }"
              :title="item.productName"
              :isLiked="!!item.is_favorite"
              :to="`/${defaultLangCode}/product-travel/detail/${item.id}`"
              :exact="true"
              :product_id="item.id"
              :product_type="PRODUCT_TYPE.PRODUCT"
              :status="item.status"
              has-price
              square
              :showInfo="false"
              @success="successLikeTravel"
            >
              <b slot="price"><b class="primary">
              {{ item.price | priceTransform(currentExchangeRate) | numeralFormat}} 
              </b>{{ currentUnitCode }} / {{$t('product.index')}}</b>
            </DestinationBox>
          </div>
        </div>
      </div>

      <div class="modal-search_highlight mt-4" v-if="!filterResult">
        <h3>{{$t("header.seach_result")}}</h3>

        <div v-if="filterResult && keyword.length > 0" class="color-red">
          {{$t("header.no_result")}}
        </div>
        <div v-if="keyword.length === 0 && totalSearchCommon === 0">
          {{$t("header.please_input_key")}}
        </div>
        <div v-if="totalSearchCommon > 0" class="primary">
          {{ totalSearchCommon }} {{$t("header.seach_result")}}
        </div>

        <div class="row mt-3">
          <div
            class="col-6 col-md-4"
            v-for="(item, index) in filterSearchCommonItems"
            :key="index"
          >
            <DestinationBox
              type="no-box"
              :img-attrs="{
                src: item.thumbnail,
                alt: item.sub_title
              }"
              :title="item.name"
              :rating="item.rating_score"
              :ratingCount="item.total_rating"
              :isLiked="!!item.is_favorite"
              :address="item.address"
              :to="item.link"
              :showInfo="true"
              :product_id="item.id"
              :product_type="item.product_type"
              :status="item.status"
              hasPrice
            />
          </div>
        </div>
        <div class="container">
          <AppPagination :pageable="searchCommonPagination" />
        </div>
      </div>

      <SearchNoResult v-else/>
    </v-modal>
  </client-only>
</template>

<script>
import { COMPONENT_SIZE_LIST, PRODUCT_TYPE } from '~/utils/constants';
import IconSearch from '~/assets/icons/search.svg?inline';
import IconLike from '~/assets/icons/heart-2.svg?inline';
import IconDislike from '~/assets/icons/heart.svg?inline';
import IconStar from '~/assets/icons/star.svg?inline';
import IconPin from '~/assets/icons/pin.svg?inline';
import DestinationBox from '~/components/pages/common/DestinationBox';
import SuggestSearch from '~/components/pages/common/SuggestSearch';
import SearchNoResult from '~/components/pages/common/SearchNoResult';
import AppPagination from '~/components/app/AppPagination';

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { get } from 'lodash';
import { PAGER } from '~/utils/constants';
import { convertSearchPayload } from '~/utils/common';

export default {
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    visible: Boolean
  },

  components: {
    IconSearch,
    IconLike,
    IconDislike,
    IconStar,
    IconPin,
    DestinationBox,
    SuggestSearch,
    AppPagination,
    SearchNoResult
  },

  data() {
    return {
      keyword: '',
      result: false,
      isSuggest: false,
      historySearch: [],
      dataKeyWord: '',
      isSearch: null,
      oldValKeyword: '',
      tab: 1,
      PRODUCT_TYPE
    };
  },

  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  },

  computed: {
    ...mapGetters('common/common', [
      'searchCommonItems',
      'searchCommonPagination',
      'totalSearchCommon',
      'defaultLangCode',
      'currentExchangeRate',
      'currentUnitCode'
    ]),
    ...mapState('common/common', [
      'suggestion_most', 
      'tourSearch',
      'suggestionHotel',
      'suggestionRestaurant',
      'suggestionTour',
      'suggestionTravel',
    ]),

    ...mapState('common/eventBus', ['isShowModalSearch']),
    ...mapGetters('auth/auth', ['isAuthenticated']),

    // historyData() {
    //   if (this.isSearch === false) {
    //     return JSON.parse(localStorage.getItem('history_search')) &&
    //       JSON.parse(localStorage.getItem('history_search')).length > 0
    //       ? JSON.parse(localStorage.getItem('history_search')).slice(0, 3)
    //       : [];
    //   } else {
    //     this.isSearch = false;
    //     return JSON.parse(localStorage.getItem('history_search')) &&
    //       JSON.parse(localStorage.getItem('history_search')).length > 0
    //       ? JSON.parse(localStorage.getItem('history_search')).slice(0, 3)
    //       : [];
    //   }
    // },

    checkKeyWord() {
      return this.dataKeyWord ? false : true;
    },

    filterResult() {
      return this.searchCommonItems &&
        this.searchCommonItems.length === 0 &&
        get(this.searchCommonPagination, 'total_record', null) === 0
        ? true
        : false;
    },

    filterSearchCommonItems() {
      const data = this.searchCommonItems.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    // filterTourSearch() {
    //   return get(this.tourSearch, 'items', []);
    // }
  },


  methods: {
    get,
    ...mapActions('common/common', [
      'getStatisticSearch',
      'getStatisticSuggestionMost',
      // 'getTourSearch',
      'getSuggestionHotel',
      'getSuggestionRestaurant',
      'getSuggestionTour',
      'getSuggestionTravel'
    ]),

    ...mapMutations('common/common', ['setStatisticSearch']),

    renderLink(value, id) {
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

    handleSearch() {
      this.dataKeyWord = this.keyword;
      this.isSearch = true;
      if (this.keyword === '' && this.oldValKeyword === '') {
        this.$toasted.error(this.$t('header.pls_input_key'));
      } else if (this.keyword === '' && this.oldValKeyword !== '') {
        this.setStatisticSearch({});
      } else {
        if (get(this.$route.query, 'page_index', 1) > 1) {
          let payload = convertSearchPayload({
            ...this.$route.query,
            pageIndex: 1,
          });
          this.$router.push({ path: this.$route.path, query: payload });
        }
        this.getStatisticSearch({
          keyword: this.keyword.trim(),
          page_size: PAGER.PAGE_SIZE,
          page_index: 1
        });
        this.historySearch =
          JSON.parse(localStorage.getItem('history_search')) &&
          JSON.parse(localStorage.getItem('history_search')).length > 0
            ? JSON.parse(localStorage.getItem('history_search')).slice(0, 3)
            : [];
        this.historySearch.unshift(this.keyword);
        this.historySearch.length > 3
          ? this.historySearch.slice(0, 3)
          : this.historySearch;
        localStorage.setItem(
          'history_search',
          JSON.stringify(this.historySearch)
        );
      }
    },

    // appendSearch(_val) {
    //   this.keyword = _val;
    //   this.getStatisticSearch({ keyword: this.keyword });
    // },

    resetKeyword() {
      this.keyword = '';
      this.oldValKeyword = null;
      this.handleSearch();
    },

    successLikeHotel() {
      this.getSuggestionHotel({ page_index: 1, page_size: 4 });
    },

    successLikeRestaurant() {
      this.getSuggestionRestaurant({ page_index: 1, page_size: 4 });
    },

    successLikeTour() {
      this.getSuggestionTour({ page_index: 1, page_size: 4 });
    },

    successLikeTravel() {
      this.getSuggestionTravel({ page_index: 1, page_size: 4 })
    }
  },

  mounted() {
    this.getStatisticSuggestionMost();
    // this.getTourSearch({ page_size: 9 });
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler(path) {
        this.$emit('cancel');
      }
    },
    '$route.query': function (newValue) {
      let payload = convertSearchPayload({
        keyword: this.keyword.trim(),
        page_size: PAGER.PAGE_SIZE,
        pageIndex: newValue.page_index
      });
      if (this.keyword && newValue && newValue.page_index) {
        this.getStatisticSearch(payload);
      }
    },
    keyword(newVal, oldVal) {
      this.oldValKeyword = oldVal;
    },
    isAuthenticated(newVal) {
      this.historySearch = [];
      localStorage.setItem(
        'history_search',
        JSON.stringify(this.historySearch)
      );
      this.isSearch = true;
      this.keyword = '';
      this.setStatisticSearch({});
    }
  }
};
</script>

<style lang="scss">
@import '~assets/scss/components/modals/_modal-search.scss';
</style>
