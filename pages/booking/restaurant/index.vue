<template>
<client-only>
  <div class="page-booking-wrapper">
    <div class="container">
      <div class="row">
        <div v-if="!$route.path.includes('/booking/restaurant/result')" class="col-md-4">
          <div class="bg-white mb-3 mb-md-0">
            <a :href="`/${defaultLangCode}/restaurant/detail/${restaurant.restaurant_id}`" target="_blank">
              <img
                class="d-block w-100"
                :src="restaurant.gallery && restaurant.gallery[0] ? restaurant.gallery[0].url : ''"
                :alt="restaurant.name"
              />
            </a>

            <div class="px-16 py-3">
              <h2 class="heading-5 mb-3">
                <a class="deep-dark" :href="`/${defaultLangCode}/restaurant/detail/${restaurant.restaurant_id}`" target="_blank">{{ restaurant.name }}</a>
              </h2>
              <div class="mb-2">
                <IconPin class="mr-2"/>{{ restaurant.address }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="d-flex flex-column"
          :class="!$route.path.includes('/booking/restaurant/result') ? 'col-md-8' : 'col-12'"
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
import IconPin from '~/assets/icons/pin2.svg?inline';

export default {
  components: {
    IconPin
  },
  layout: 'payment',

  validate({ query }) {
    return ['id', 'booking_date', 'person_quantity', 'booking_hour'].every(
      (key) => key in query
    );
  },

  scrollToTop: true,

  async fetch() {
    try {
      const { id } = this.$route.query;
      const result = await this.getRestaurantDetail({
        restaurant_id: id
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
    ...mapState('restaurant/restaurant', {
      restaurant: 'restaurant_detail'
    }),
    ...mapGetters('common/common', ['defaultLangCode']),

    schedule() {
      const { schedule_id } = this.$route.query;
      if (!this.restaurant.departure_schedule || !schedule_id) return {};
      const item = this.restaurant.departure_schedule.find(
        (item) => item.id == schedule_id
      );
      return item || {};
    }
  },

  created() {
    this.setHeaderPaymentSteps([
      {
        text: this.$t('booking.infor'),
        routePath: `/booking/restaurant/review`
      },
      {
        text: this.$t('restaurant.confirm'),
        routePath: `/booking/restaurant/confirmation`
      },
      {
        text: this.$t('booking.success'),
        routePath: `/booking/restaurant/result`
      }
    ]);
  },

  mounted() {
    window.addEventListener('beforeunload', this.handleWindowBeforeUnload);
  },

  // beforeRouteLeave(to, from, next) {
  //   if (!this.$route.path.includes('/booking/restaurant/result')) {
  //     const answer = window.confirm(
  //       this.$t('booking.confirm_out')
  //     );
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
    this.setHeaderPaymentSteps([])
  },

  methods: {
    ...mapActions('restaurant/restaurant', ['getRestaurantDetail']),
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
