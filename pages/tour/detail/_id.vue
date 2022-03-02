<template>
  <div v-if="!$fetchState.pending" class="container py-24">
    <OverviewImg
      class="mb-24"
      :title="tour && tour.name ? tour.name : ''"
      :is-favorite="!!tour.is_favorite"
      :images="tour.gallery || []"
      :status="tour.status"
      :product-type="PRODUCT_TYPE.TOUR"
      @favorite="handleFavorite"
    >
      <template slot="address"
        ><IconJourney class="icon" />{{ $t('tour.journey') }}&nbsp;
        <a href="javascript:;">{{ tour.journeys }}</a></template
      >

      <v-button
        slot="booking"
        class="overview-img__btn-booking"
        variant="primary"
        nuxt
        :to="{
          path: `/${defaultLangCode}/booking/tour`,
          query: {
            id: tour.tour_id,
            schedule_id: null,
            adults: 0,
            children: 0,
            start_date: null
          }
        }"
        :disabled="btnBookNowDisabled"
        >{{ $t('tour.book_now') }}</v-button
      >
    </OverviewImg>

    <TabNav
      :tabs="TABS"
      @click-tab="handleClickTab"
    />

    <OverviewBlock
      class="mb-24"
      :content="[
        { title: $t('home.time_gate'), text: startTime },
        {
          title: $t('tour.time'),
          text: `${
            tour.number_day ? `${tour.number_day}` + $t('hotel.day') : ''
          } ${
            tour.number_night ? `${tour.number_night}` + $t('hotel.night') : ''
          }`
        },
        { title: $t('tour.type_travel'), text: tour.type },
        { title: $t('tour.vehicle'), text: tour.vehicle },
        { title: $t('home.start_gate'), text: tour.start_place }
      ]"
    >
    </OverviewBlock>

    <BookTour
      class="mb-24"
      :disabled="btnBookNowDisabled"
    />

    <Introduction
      id="info"
      class="mb-24"
      :data="{
        title: $t('hotel.introduction'),
        intro: tour.name,
        content: tour.introduce
      }"
    />

    <ScheduleTour id="schedule" :data="tour.journey_detail || []" />

    <DepartureSchedule
      id="departure_schedule"
      class="mb-24"
      :departure-type="tour.departure_type"
      :schedule="schedule"
    />

    <ServiceTab
      id="services"
      class="mb-24"
      :title="SERVICE_TITLE"
      :tabs="SERVICE_TABS"
    >
      <div slot="tab1" v-html="tour.service_includes"></div>
      <div slot="tab2" v-html="tour.service_non_includes"></div>
    </ServiceTab>

    <ServiceTab
      id="terms"
      class="mb-24"
      :title="PRIVACY_TITLE"
      :tabs="PRIVACY_TABS"
    >
      <div slot="tab1" v-html="tour.surcharge_policy"></div>
      <div slot="tab2" v-html="tour.cancel_exchange_policy"></div>
      <div slot="tab3" v-html="tour.note_policy"></div>
    </ServiceTab>

    <Feedback
      id="reviews"
      class="mb-24"
      :rating="rating"
      :comments="get(tourComments, 'data', [])"
      :product_type="PRODUCT_TYPE.TOUR"
    >
      <template
        v-if="get(tourComments, 'pageable', []).total_page > 1"
        v-slot:load-more
      >
        <div class="feedback__more text-center">
          <v-button @click="onClickLoading" variant="outline-secondary" outline>
            {{
              enableBtnLoadMore
                ? $t('hotel.view_more')
                : $t('restaurant.collapse')
            }}</v-button
          >
        </div>
      </template>
    </Feedback>

    <client-only>
      <IsCare
        v-if="tour.enable_suggestion"
        id="suggestions"
        :data="tourRelated.items || []"
        :is-navigation="!!(tourRelated.items && tourRelated.items.length)"
      >
        <template slot="title">
          <h4 class="heading-5 mb-0">{{ $t('hotel.maybe_interested') }}</h4>
        </template>

        <template slot="slider-items">
          <TourBox
            v-for="(item, index) in filterTourRelated"
            :key="index"
            class="mb-5 swiper-slide"
            :img-attrs="{
              src: item.product_thumbnail_url,
              alt: item.name
            }"
            :title="item.name"
            :rating="item.rate"
            :ratingCount="item.rate_number || 0"
            :start="item.start_place"
            :destination-count="item.number_of_destinations"
            :duration-day="item.number_day"
            :duration-night="item.number_night"
            :to="item.link"
            :is-liked="!!item.is_favorite"
            :status="item.status"
            has-price
            square
            :hasActions="false"
            @like="() => handleLikeTour(item.tour_id, item.is_favorite)"
          >
            <!-- <b slot="priceStrike">1,300,000 VND</b> -->
            <b slot="price"
              >{{
                item.from_price
                  | priceTransform(currentExchangeRate)
                  | numeralFormat
              }}
              <span class="white">{{ currentUnitCode }}</span> / {{ renderTextPricde(item.product_type) }}
            </b>
          </TourBox>
        </template>
      </IsCare>
    </client-only>
  </div>
</template>

<script>
import { get, throttle } from 'lodash';
import { mapState, mapGetters, mapActions } from 'vuex';

import {
  PRODUCT_TYPE,
  COMMENTS,
  TOUR_DEPARTURE_TYPE,
  PRODUCT_STATUS
} from '~/utils/constants';
import { DATE_TIME_FORMAT, DATE_DISPLAY_FORMAT } from '~/utils/configs';
import { offset } from '~/utils/dom';

import IconJourney from '~/assets/icons/journey.svg?inline';
import OverviewImg from '~/components/pages/common/OverviewImg';
import TabNav from '~/components/pages/common/TabNav';
import OverviewBlock from '~/components/pages/common/OverviewBlock';
import BookTour from '~/components/pages/tour/BookTour';
import Introduction from '~/components/pages/common/Introduction';
import ScheduleTour from '~/components/pages/tour/ScheduleTour';
import DepartureSchedule from '~/components/pages/tour/DepartureSchedule';
import ServiceTab from '~/components/pages/tour/ServiceTab';
import Feedback from '~/components/pages/common/Feedback';
import IsCare from '~/components/pages/common/IsCare';
import TourBox from '~/components/pages/common/TourBox';

export default {
  components: {
    IconJourney,
    OverviewImg,
    TabNav,
    OverviewBlock,
    BookTour,
    Introduction,
    ScheduleTour,
    DepartureSchedule,
    ServiceTab,
    Feedback,
    IsCare,
    TourBox
  },

  head() {
    return {
      title: this.tour && this.tour.name ? this.tour.name : ''
    };
  },

  data() {
    return {
      page_index: 1
    };
  },

  computed: {
    ...mapState('tour/tour', {
      tour: 'tourDetail',
      tourRelated: 'tourRelated',
      tourComments: 'tourComments'
    }),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),

    filterTourRelated() {
      const dataTour = get(this.tourRelated, 'items', []);
      const data = dataTour.map((item) => {
        return {
          ...item,
          link: this.renderLink(item.product_type, item.id)
        };
      });
      return data;
    },

    startTime() {
      return this.tour.start_time
        ? this.tour.start_time
            .split(',')
            .map((item) =>
              this.$moment(item.trim(), DATE_TIME_FORMAT).format(
                DATE_DISPLAY_FORMAT
              )
            )
            .join(', ')
        : '';
    },

    rating() {
      const vote_number = get(this.tour, 'vote_number', 0);
      const vote_score = get(this.tour, 'vote_score', 0);

      return {
        number_review: vote_number,
        rank: vote_score
      };
    },

    enableBtnLoadMore() {
      const pageable = get(this.tourComments, 'pageable', {});

      return pageable.total_page > this.page_index;
    },

    schedule() {
      const {
        departure_type: type,
        departure_schedule: schedulePlan = [],
        tour_departure_schedule_daily: scheduleDaily = {},
        tour_departure_schedule_weekly: scheduleWeekly = {}
      } = this.tour;

      if (type === TOUR_DEPARTURE_TYPE.DAILY) {
        return [
          {
            start: this.$t('tour.every_day'),
            end: '',
            price: scheduleDaily.adult_price,
            priceChild: scheduleDaily.child_price
          }
        ];
      }

      if (type === TOUR_DEPARTURE_TYPE.WEEKLY) {
        let startText = [];
        const DAYS = {
          mo: this.$t('tour.monday'),
          tu: this.$t('tour.tuesday'),
          we: this.$t('tour.wenesday'),
          th: this.$t('tour.thursday'),
          fr: this.$t('tour.friday'),
          sa: this.$t('tour.saturday'),
          su: this.$t('tour.sunday')
        };

        for (const key in DAYS) {
          scheduleWeekly[key] && startText.push(DAYS[key]);
        }

        return [
          {
            start: startText.join(', '),
            end: '',
            price: scheduleWeekly.adult_price,
            priceChild: scheduleWeekly.child_price
          }
        ];
      }

      if (type === TOUR_DEPARTURE_TYPE.PLAN) {
        return schedulePlan.map((item) => ({
          start: this.$moment(item.start_time, DATE_TIME_FORMAT).format(
            'dd - DD/MM/YYYY'
          ),
          end: this.$moment(item.return_time, DATE_TIME_FORMAT).format(
            'dd - DD/MM/YYYY'
          ),
          price: item.adult_price,
          priceChild: item.chil_price
        }));
      }
    },

    btnBookNowDisabled() {
      const { tour = {}, $fetchState = {} } = this;
      const isDisbled = !$fetchState.pending && tour.status != 1;
      const isNoPlan = tour.departure_type === TOUR_DEPARTURE_TYPE.PLAN && !this.schedule.length;
      return isDisbled || isNoPlan;
    }
  },

  async fetch() {
    const { id, category_id } = this.$route.params;
    await Promise.all([
      this.getTourDetail({
        tour_id: id,
        category_id
      }),
      this.getTourRelated({
        tour_id: id
      }),
      this.getTourComment({
        tour_id: id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: 1
      })
    ]);
  },

  created() {
    const TABS = [
      {
        title: this.$t('tour.infor_tour'),
        attrs: {
          href: '#info'
        }
      },
      {
        title: this.$t('tour.schedule'),
        attrs: {
          href: '#schedule'
        }
      },
      {
        title: this.$t('tour.departure_schedule'),
        attrs: {
          href: '#departure_schedule'
        }
      },
      {
        title: this.$t('tour.service'),
        attrs: {
          href: '#services'
        }
      },
      {
        title: this.$t('tour.policy_term'),
        attrs: {
          href: '#terms'
        }
      },
      {
        title: this.$t('hotel.evaluation_2'),
        attrs: {
          href: '#reviews'
        }
      },
      {
        title: this.$t('tour.maybe_interested'),
        attrs: {
          href: '#suggestions'
        }
      }
    ];

    const SERVICE_TITLE = this.$t('tour.service');
    const SERVICE_TABS = [
      this.$t('tour.service_includes'),
      this.$t('tour.service_not_includes')
    ];
    const PRIVACY_TITLE = this.$t('tour.policy_term');
    const PRIVACY_TABS = [
      this.$t('tour.surcharge_regulations'),
      this.$t('tour.cancel'),
      this.$t('tour.note')
    ];

    this.PRODUCT_TYPE = Object.freeze(PRODUCT_TYPE);
    this.TABS = Object.freeze(TABS);
    this.COMMENTS = Object.freeze(COMMENTS);
    this.TOUR_DEPARTURE_TYPE = Object.freeze(TOUR_DEPARTURE_TYPE);
    this.PRODUCT_STATUS = Object.freeze(PRODUCT_STATUS);

    this.DATE_TIME_FORMAT = DATE_TIME_FORMAT;
    this.SERVICE_TITLE = SERVICE_TITLE;
    this.SERVICE_TABS = SERVICE_TABS;
    this.PRIVACY_TITLE = PRIVACY_TITLE;
    this.PRIVACY_TABS = PRIVACY_TABS;
  },

  mounted() {
    window.addEventListener('scroll', this.handleWindowScroll);
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleWindowScroll);
  },

  methods: {
    ...mapActions('tour/tour', [
      'getTourDetail',
      'postTourDetailFavorite',
      'getTourRelated',
      'postTourFavorite',
      'getTourComment'
    ]),

    get,

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
        const { tour_id, is_favorite } = this.tour;
        const doFavorite = await this.postTourDetailFavorite({
          type: PRODUCT_TYPE.TOUR,
          id: tour_id,
          isFavorite: is_favorite ? 0 : 1
        });

        this.$toast.global.primary(
          is_favorite
            ? this.$t('home.delete') + ' ' + this.$t('home.from_list_favourite')
            : this.$t('home.save') + ' ' + this.$t('home.to_list_favourite')
        );
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
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

    handleWindowScroll: throttle(function (event) {
      const tabNavEl = document.querySelector('.tab-nav .tab-nav__content');
      const mainNavLinks = document.querySelectorAll(".tab-nav a[href^='#']");
      if (!mainNavLinks || mainNavLinks.length < 1) return;

      let fromTop = window.scrollY + mainNavLinks[0].clientHeight + 24;

      mainNavLinks.forEach((link) => {
        let section = document.querySelector(link.hash);
        if (!section) return;

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
      const section = document.querySelector(href);

      window.scrollTo({
        top: offset(section).top - linkEl.clientHeight - 24,
        behavior: 'smooth'
      });
    },

    onClickLoading() {
      this.page_index = this.enableBtnLoadMore ? this.page_index + 1 : 1;
      this.getTourComment({
        tour_id: this.$route.params.id,
        page_size: COMMENTS.PAGE_SIZE,
        page_index: this.page_index
      });
    }
  }
};
</script>
