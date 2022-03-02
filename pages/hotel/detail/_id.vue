<template>
  <div class="container py-24">
    <client-only>
      <div class="detail-hotel">
        <OverviewImg
          class="mb-24"
          typeService="hotel"
          :title="get(hotel, 'name', '')"
          :address="get(hotel, 'address', '')"
          :is-favorite="!!hotel.is_favorite"
          :images="get(hotel, 'gallery', [])"
          :status="hotel.status"
          :product-type="PRODUCT_TYPE.HOTEL"
          @favorite="handleFavorite"
        >
          <template slot="booking">
            <a
              class="overview-img__btn-booking"
              variant="primary"
              :tag="'a'"
              href="#"
              v-scroll-to="{
                el: '#restroom',
                offset: -100
              }"
              >{{ $t('hotel.book_now') }}</a
            >
          </template>
        </OverviewImg>
        <TabNav
          :tabs="dataTabs"
          @click-tab="handleClickTab"
        />

        <TabOverviewHotel class="mb-24" id="info" />

        <Introduction class="mb-24" :data="introHotel" />
        <ServiceAndUtility
          id="service"
          class="mb-24"
          :data="get(hotel, 'convenient_services', [])"
        />
        <Booking
          id="restroom"
          class="mb-24"
          @range="onChangeRangeTime"
          :data="listRestRoom"
          :images="get(hotel, 'gallery', [])"
          :services="get(hotel, 'rest_room_services', [])"
          :disabled="!$fetchState.pending && hotel.status != 1"
        >
        </Booking>
        <LocalAround
          :showTab="get(hotel, 'enable_map', false)"
          id="location_around"
          class="mb-24"
          :type="type ? type : get(hotel, 'location_around[0].group_id', [])"
          :data="get(hotel, 'location_around', [])"
          :center="{ lat: get(hotel, 'lat', 0), lon: get(hotel, 'lon', 0) }"
        />

        <Feedback
          v-if="hotel.enable_rating === 1"
          id="review"
          class="mb-24"
          :rating="get(hotel, 'rating', {})"
          :comments="get(hotelComments, 'data', [])"
          :product_type="PRODUCT_TYPE.HOTEL"
        >
          <template
            v-if="get(this.hotelComments, 'pageable', {}).total_page > 1"
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
          v-if="hotel.enable_suggestion === 1"
          id="interested"
          class="mb-24"
          :data="hotelRelatedData"
          :is-navigation="!!hotelRelatedData.length"
        >
          <template slot="slider-items">
            <DestinationBox
              v-for="(item, index) in filterHotelRelatedData"
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
                  {{ currentUnitCode }} </span
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
import OverviewImg from '~/components/pages/common/OverviewImg.vue';
import TabNav from '~/components/pages/common/TabNav';
import TabOverviewHotel from '~/components/pages/hotel/TabOverviewHotel';
import Introduction from '~/components/pages/common/Introduction';
import ServiceAndUtility from '~/components/pages/common/ServiceAndUtility';
import Booking from '~/components/pages/hotel/Booking';
import LocalAround from '~/components/pages/common/LocalAround';
import Feedback from '~/components/pages/common/Feedback';
import IsCare from '~/components/pages/common/IsCare';

import { PRODUCT_TYPE, COMMENTS, PRODUCT_STATUS } from '~/utils/constants';
import { offset } from '~/utils/dom';
import * as configs from '~/utils/configs';
import { get, throttle, find, map } from 'lodash';

import { mapActions, mapState, mapGetters } from 'vuex';
import { GET_UTILITIES_PRICE_RANGE } from '~/utils/action-type/common';

export default {
  components: {
    OverviewImg,
    TabNav,
    TabOverviewHotel,
    Introduction,
    ServiceAndUtility,
    Booking,
    LocalAround,
    Feedback,
    IsCare
  },

  async asyncData({ route, store }) {
    const { id, category_id } = route.params;
    const hotel = await store.dispatch('hotel/hotel/getHotelDetail', {
      hotel_id: id,
      category_id
    });
    return {
      listRestRoom: hotel.data.rest_rooms || []
    };
  },

  async fetch() {
    const { id, category_id } = this.$route.params;
    await Promise.all([
      this.getHotelRelated({
        hotel_id: id,
        category_id
      }),
      this.getHotelComment({
        hotel_id: id,
        category_id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: 1
      })
    ]);
  },

  data() {
    return {
      PRODUCT_TYPE,
      COMMENTS,
      type: PRODUCT_TYPE.HOTEL,
      today: this.$moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      checkout_time: null,
      page_index: 1
    };
  },
  mounted() {
    // if has time checkin and checkout
    const range = {
      check_in: get(this.$route.query, 'checkin_time', null),
      check_out: get(this.$route.query, 'checkout_time', null)
    };
    this.onChangeRangeTime(range);
    window && window.addEventListener('scroll', this.handleWindowScroll);
  },

  beforeDestroy() {
    window && window.removeEventListener('scroll', this.handleWindowScroll);
  },

  computed: {
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail',
      hotelRelated: 'hotel_related',
      hotelComments: 'hotel_comments'
    }),

    ...mapGetters('hotel/hotel', ['hotelRelatedData']),

    ...mapGetters('auth/auth', ['isAuthenticated']),

    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),

    filterHotelRelatedData() {
      const data = this.hotelRelatedData.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    introHotel() {
      return {
        title: this.$t('hotel.introduction'),
        intro: '',
        content: this.hotel.general_introduction || ''
      };
    },

    enableBtnLoadMore() {
      const pageable = get(this.hotelComments, 'pageable', {});

      return pageable.total_page > this.page_index;
    },

    hotelDefaultId() {
      const restRooms = find(
        get(this.hotel, 'rest_rooms', []),
        (r) => r.room_number - r.room_number_used > 0
      );
      return restRooms ? restRooms.rest_room_id : null;
    },

    dataTabs() {
      const data = [
        {
          title: this.$t('hotel.overview'),
          attrs: {
            href: '#info'
          }
        },
        {
          title: this.$t('hotel.restroom'),
          attrs: {
            href: '#restroom'
          }
        }
      ];
      if (this.hotel.enable_map) {
        data.push({
          title: this.$t('hotel.local_around'),
          attrs: {
            href: '#location_around'
          }
        });
      }
      if (this.hotel.enable_rating) {
        data.push({
          title: this.$t('hotel.evaluation_2'),
          attrs: {
            href: '#review'
          }
        });
      }
      if (this.hotel.enable_suggestion) {
        data.push({
          title: this.$t('hotel.maybe_interested'),
          attrs: {
            href: '#interested'
          }
        });
      }
      return data;
    },
  },

  created() {
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);
  },

  methods: {
    get,

    ...mapActions('hotel/hotel', [
      'getHotelDetail',
      'getHotelRelated',
      'postHotelDetailFavorite',
      'getHotelComment',
      'getHotelBookingCheckHotel'
    ]),

    async onChangeRangeTime(_range) {
      // 1. get list hotel avaible
      if (!_range.check_in || !_range.check_out) return;
      const res = await this.getHotelBookingCheckHotel({
        hotel_id: this.$route.params.id,
        check_in: _range.check_in,
        check_out: _range.check_out
      });
      if (res.code === configs.RES_STATUS_SUCCESS) {
        const rooms = res.data;
        this.listRestRoom = map(rooms, (room) => {
          const rr = find(
            this.listRestRoom,
            (item) => item.rest_room_id === room.roomId
          );
          if (!rr) return room;
          rr.room_available = room.roomAvailable;
          return rr;
        });
      }
    },

    getTab() {
      let position = 3;
      if (this.hotel.enable_map) {
        this.tabs.push({
          title: this.$t('hotel.local_around'),
          attrs: {
            href: '#location_around'
          },
          position: position
        });
        position++;
      }
      if (this.hotel.enable_rating) {
        this.tabs.push({
          title: this.$t('hotel.evaluation_2'),
          attrs: {
            href: '#review'
          },
          position: position
        });
        position++;
      }
      if (this.hotel.enable_suggestion) {
        this.tabs.push({
          title: this.$t('hotel.maybe_interested'),
          attrs: {
            href: '#interested'
          },
          position: position
        });
        position++;
      }
    },

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

    async handleFavorite() {
      if (this.isAuthenticated) {
        const { hotel_id, is_favorite } = this.hotel;
        const doFavorite = await this.postHotelDetailFavorite({
          type: PRODUCT_TYPE.HOTEL,
          id: hotel_id,
          isFavorite: is_favorite ? 0 : 1
        });
        if (doFavorite.code == configs.RES_STATUS_SUCCESS) {
          this.$toast.global.primary(
            is_favorite
              ? this.$t('home.delete') +
                  ' ' +
                  this.$t('home.from_list_favourite')
              : this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
          );
        }
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },
    handleWindowScroll: throttle(function (event) {
      const tabNavEl = document.querySelector('.tab-nav .tab-nav__content');
      const mainNavLinks = document.querySelectorAll(".tab-nav a[href^='#']");
      if (!mainNavLinks || mainNavLinks.length < 1) return;
      let fromTop = window.scrollY + mainNavLinks[0].clientHeight + 24;

      mainNavLinks.forEach((link) => {
        if (!link || !link.hash) return;
        let section = document.querySelector(link.hash);
        if (!section || section.length < 1) return;

        if (
          section.offsetTop <= fromTop &&
          section.offsetTop + section.offsetHeight > fromTop
        ) {
          link.classList.add('active');
          tabNavEl.scrollLeft = link.offsetLeft;
        } else {
          link.classList.remove('active');
        }
      });
    }, 150),

    handleClickTab(event, tab) {
      event.preventDefault();
      const linkEl = event.target;
      const { href } = tab.attrs;

      if (!href) return;
      const section = document.querySelector(href);
      if (!section || section.length < 1) return;

      window &&
        window.scrollTo({
          top: offset(section).top - linkEl.clientHeight - 24,
          behavior: 'smooth'
        });
    },

    onClickLoading() {
      this.page_index = this.enableBtnLoadMore ? this.page_index + 1 : 1;
      this.getHotelComment({
        hotel_id: this.$route.params.id,
        category_id: this.$route.params.category_id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: this.page_index
      });
    }
  },

  head() {
    return {
      title: this.hotel.name
    };
  }
};
</script>

<style lang="scss" scoped>
.overview-img__btn-booking {
  color: #fff !important;
  background-color: #47bbff !important;
  border-color: #47bbff;
  display: inline-block;
  font-weight: 700;
  line-height: 1.5;
  color: #656565;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.85rem 1.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
</style>
