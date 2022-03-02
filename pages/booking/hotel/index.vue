<template>
<client-only>
  <div class="page-booking-wrapper">
    <div class="container">
      <div class="row">
        <div v-if="!$route.path.includes('/booking/hotel/result')" class="col-md-4">
          <div class="bg-white mb-3 mb-md-24">
            <a
              :href="`/${defaultLangCode}/hotel/detail/${hotel.hotel_id}`"
              target="_blank"
            >
              <img
                class="d-block w-100"
                :src="
                  hotel.gallery && hotel.gallery[0] ? hotel.gallery[0].url : ''
                "
                :alt="hotel.name"
              />
            </a>

            <div class="px-16 py-3">
              <h2 class="heading-5 mb-3">
                <a
                  class="deep-dark"
                  :href="`/hotel/detail/${hotel.hotel_id}`"
                  target="_blank"
                  >{{ hotel.name }}</a
                >
              </h2>

              <p class="secondary">{{ restRoom.room_type || '' }}</p>
              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('hotel.area') }}</span>
                <span>{{ restRoom.acreage }} m2</span>
              </div>

              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('hotel.bed') }}</span>
                <span>
                  {{ restRoom.bed_type || '' }} {{ $t('hotel.people') }}</span
                >
              </div>

              <div
                class="d-flex align-items-baseline justify-content-between mb-2"
              >
                <span class="text-nowrap mr-2">{{ $t('hotel.capacity') }}</span>
                <span>
                  {{ restRoom.number_adults + restRoom.number_children || '' }}
                  {{ $t('hotel.people') }}</span
                >
              </div>

              <template v-if="!checkPath">
                <v-divider />

                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2"></span>
                  <span class="secondary">
                    {{
                      restRoom.price
                        | priceTransform(currentExchangeRate)
                        | numeralFormat
                    }}
                    {{ currentUnitCode }} / {{ $t('hotel.night') }}</span
                  >
                </div>
              </template>
              <template v-else>
                <v-divider />

                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2">{{
                    $t('booking.price_night')
                  }}</span>
                  <span class="secondary">
                    {{
                      restRoom.price
                        | priceTransform(currentExchangeRate)
                        | numeralFormat
                    }}
                    {{ currentUnitCode }} / {{ $t('hotel.night') }}</span
                  >
                </div>
                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2">{{
                    $t('booking.number_night')
                  }}</span>
                  <span class="secondary">
                    {{ totalNumberNight }}
                    {{ $t('hotel.night') }}</span
                  >
                </div>
                <v-divider />
                <div
                  class="d-flex align-items-baseline justify-content-between mb-2"
                >
                  <span class="text-nowrap mr-2">{{
                    $t('booking.payment')
                  }}</span>
                  <span class="secondary">
                    {{ totalPrice | numeralFormat }}
                    {{ currentUnitCode }}</span
                  >
                </div>
              </template>
            </div>
          </div>

          <div class="bg-white pa-16 mb-3 mb-md-24">
            <h5 class="mb-16">{{ $t('booking.cancel_booking') }}</h5>
            <div class="booking-policy mb-2" v-html="hotel.policy"></div>
          </div>

          <div class="bg-white pa-16 mb-3 mb-md-0">
            <h5 class="mb-16">{{ $t('booking.note_booking') }}</h5>
            <div class="booking-note mb-2" v-html="hotel.note"></div>
          </div>
        </div>

        <div
          class="d-flex flex-column"
          :class="
            !$route.path.includes('/booking/hotel/result') ? 'col-md-8' : 'col-12'
          "
        >
          <nuxt-child :restRoom="restRoom" />
        </div>
      </div>
    </div>
  </div>
</client-only>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  layout: 'payment',

  validate({ query }) {
    return ['hotel_id'].every((key) => key in query);
  },

  async fetch() {
    try {
      const { hotel_id } = this.$route.query;
      const result = await this.getHotelDetail({
        hotel_id
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
    ...mapState('hotel/hotel', {
      hotel: 'hotel_detail'
    }),
    ...mapGetters('common/common', [
      'currentExchangeRate',
      'currentUnitCode',
      'defaultLangCode'
    ]),

    restRoom() {
      const { room_id } = this.$route.query;
      if (!this.hotel.rest_rooms || !room_id) return {};
      const item = this.hotel.rest_rooms.find(
        (item) => item.rest_room_id == room_id
      );
      return item || {};
    },
    checkPath() {
      const { path } = this.$route;
      return path.includes('/booking/hotel/confirmation') ||
        path.includes('booking/hotel/payment')
        ? true
        : false;
    },
    totalPrice() {
      const { total_price } = this.$route.query;
      return Number(total_price);
    },
    totalRoom() {
      const { number_room_booked } = this.$route.query;
      return Number(number_room_booked);
    },
    totalNumberNight() {
      return Math.round(
        (this.totalPrice * this.currentExchangeRate) /
          (this.restRoom.price * this.totalRoom)
      );
    }
  },

  created() {
    this.setHeaderPaymentSteps([
      {
        text: this.$t('booking.infor'),
        routePath: `/booking/hotel/review`
      },
      {
        text: this.$t('restaurant.confirm'),
        routePath: `/booking/hotel/confirmation`
      },
      {
        text: this.$t('booking.payment_method'),
        routePath: `/booking/hotel/payment`
      },
      {
        text: this.$t('booking.success'),
        routePath: `/booking/hotel/result`
      }
    ]);
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  },

  beforeDestroy() {
    window &&
      window.removeEventListener('beforeunload', this.handleWindowBeforeUnload);
    this.setHeaderPaymentSteps([]);
  },

  methods: {
    ...mapActions('hotel/hotel', ['getHotelDetail']),
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
