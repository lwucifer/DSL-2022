<template>
<client-only>
  <div class="page-booking-wrapper">
    <div class="container">
      <div class="row">
        <div v-if="!$route.path.includes('/booking/tour/result')" class="col-md-4">
          <div class="bg-white mb-3 mb-md-24">
            <a
              :href="`/${defaultLangCode}/tour/detail/${tour.tour_id}`"
              target="_blank"
            >
              <img
                class="d-block w-100"
                :src="
                  tour.gallery && tour.gallery[0] ? tour.gallery[0].url : ''
                "
                :alt="tour.name"
              />
            </a>

            <div class="px-16 py-3">
              <h2 class="heading-5 mb-3">
                <a
                  class="deep-dark"
                  :href="`/${defaultLangCode}/tour/detail/${tour.tour_id}`"
                  target="_blank"
                  >{{ tour.name }}</a
                >
              </h2>

              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('tour.schedule') }}:</span>
                <span
                  >{{
                    tour.number_day
                      ? `${tour.number_day}` + $t('hotel.day')
                      : ''
                  }}
                  {{
                    tour.number_night
                      ? `${tour.number_night}` + $t('hotel.night')
                      : ''
                  }}</span
                >
              </div>
              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('booking.start') }}</span>
                <span>{{ tour.start_place }}</span>
              </div>

              <v-divider />

              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('header.adults') }}:</span>
                <span class="secondary"
                  >{{
                    schedule.adultPrice
                      | priceTransform(currentExchangeRate)
                      | numeralFormat
                  }}
                  {{ currentUnitCode }}
                  / {{ $t('hotel.people') }}</span
                >
              </div>

              <div class="d-flex align-items-baseline justify-content-between">
                <span class="text-nowrap mr-2"
                  >{{ $t('restaurant.children') }}:</span
                >
                <span class="secondary"
                  >{{
                    schedule.childPrice
                      | priceTransform(currentExchangeRate)
                      | numeralFormat
                  }}
                  {{ currentUnitCode }}
                  / {{ $t('hotel.people') }}</span
                >
              </div>

              <template v-if="checkPath">
                <v-divider />

                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2">{{
                    $t('booking.payment')
                  }}</span>
                  <span class="secondary ml-16"
                    >{{ totalPrice | numeralFormat }}
                    {{ defaultCurrency.code }}</span
                  >
                </div>
              </template>
            </div>
          </div>

          <div v-if="tour.note" class="bg-white pa-16 mb-3 mb-md-0">
            <h5 class="mb-16">{{ $t('booking.note_booking_tour') }}</h5>
            <div v-html="tour.note"></div>
          </div>
        </div>

        <div
          class="d-flex flex-column"
          :class="!$route.path.includes('/booking/tour/result') ? 'col-md-8' : 'col-12'"
        >
          <nuxt-child :schedule="schedule" />
        </div>
      </div>
    </div>
  </div>
</client-only>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { DATE_TIME_FORMAT } from '~/utils/configs';
import { TOUR_DEPARTURE_TYPE } from '~/utils/constants';

export default {
  layout: 'payment',

  validate({ query }) {
    return ['id', 'adults', 'children', 'start_date'].every(
      (key) => key in query
    );
  },

  scrollToTop: true,

  async fetch() {
    try {
      const { id } = this.$route.query;
      const result = await this.getTourDetail({
        tour_id: id
      });

      if (result.error) {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        throw new Error(result.error.message);
        return;
      }
    } catch (error) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error(error.message);
    }
  },

  computed: {
    ...mapState('tour/tour', {
      tour: 'tourDetail'
    }),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),
    ...mapState('common/common', ['defaultCurrency']),
    schedule() {
      const {
        departure_type: type,
        tour_departure_schedule_daily: scheduleDaily = {},
        tour_departure_schedule_weekly: scheduleWeekly = {},
        departure_schedule: schedulePlan = []
      } = this.tour;

      if (type === TOUR_DEPARTURE_TYPE.DAILY)
        return {
          adultPrice: scheduleDaily.adult_price,
          childPrice: scheduleDaily.child_price
        };
      if (type === TOUR_DEPARTURE_TYPE.WEEKLY)
        return {
          adultPrice: scheduleWeekly.adult_price,
          childPrice: scheduleWeekly.child_price
        };
      if (type === TOUR_DEPARTURE_TYPE.PLAN) {
        const { start_date } = this.$route.query;
        if (start_date) {
          const startDate = this.$moment(start_date, DATE_TIME_FORMAT)
            .toDate()
            .setHours(0, 0, 0, 0);
          const selectedSchedule = schedulePlan.find((item) => {
            const startTimeParsed = this.$moment(
              item.start_time,
              DATE_TIME_FORMAT
            )
              .toDate()
              .setHours(0, 0, 0, 0);
            return startDate === startTimeParsed;
          });

          if (selectedSchedule)
            return {
              adultPrice: selectedSchedule.adult_price,
              childPrice: selectedSchedule.chil_price
            };
        }
      }

      return {};
    },

    checkPath() {
      const { path } = this.$route;
      return path.includes('/booking/tour/confirmation') ||
        path.includes('/booking/tour/payment')
        ? true
        : false;
    },

    totalPrice() {
      const { total_price } = this.$route.query;
      return total_price;
    }
  },

  created() {
    this.TOUR_DEPARTURE_TYPE = Object.freeze(TOUR_DEPARTURE_TYPE);
    this.setHeaderPaymentSteps([
      {
        text: this.$t('booking.infor'),
        routePath: `/booking/tour/review`
      },
      {
        text: this.$t('restaurant.confirm'),
        routePath: `/booking/tour/confirmation`
      },
      {
        text: this.$t('booking.payment_method'),
        routePath: `/booking/tour/payment`
      },
      {
        text: this.$t('booking.success'),
        routePath: `/booking/tour/result`
      }
    ]);
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  },

  // beforeRouteLeave(to, from, next) {
  //   if (!this.$route.path.includes('/booking/tour/result')) {
  //     const answer = window.confirm(this.$t('booking.confirm_out'));
  //     if (answer) {
  //       next();
  //     } else {
  //       next(false);
  //     }
  //   } else {
  //     next();
  //   }
  // },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    this.setHeaderPaymentSteps([]);
  },

  methods: {
    ...mapActions('tour/tour', ['getTourDetail']),
    ...mapMutations('common/headerPayment', ['setHeaderPaymentSteps']),

    handleWindowBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = '';
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/pages/_booking.scss';
</style>
