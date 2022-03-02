<template>
  <section class="departure-schedule">
    <h2 class="departure-schedule__title heading-5">{{$t("tour.departure_schedule")}}</h2>

    <div class="departure-schedule__table">
      <table>
        <thead>
          <tr>
            <th>{{$t("tour.date_start")}} {{ departureType === TOUR_DEPARTURE_TYPE.WEEKLY ? $t('tour.every_week') : '' }}</th>
            <th v-if="departureType === TOUR_DEPARTURE_TYPE.PLAN" class="deskop"></th>
            <th v-if="departureType === TOUR_DEPARTURE_TYPE.PLAN">{{$t("tour.return_date")}}</th>
			<th class="mobile">{{$t("tour.price_adult")}}/{{$t("tour.price_children")}}</th>
            <th class="deskop">{{$t("tour.price_adult")}}</th>
            <th class="deskop">{{$t("tour.price_children")}}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in schedule" :key="index">
            <td :width="departureType === TOUR_DEPARTURE_TYPE.PLAN ? 150 : ''">{{ item.start }}</td>
            <td
              v-if="departureType === TOUR_DEPARTURE_TYPE.PLAN"
              class="text-center deskop"
              :width="departureType === TOUR_DEPARTURE_TYPE.PLAN ? 122 : ''"
            >
              <ImagePlaneTrip />
            </td>
            <td v-if="departureType === TOUR_DEPARTURE_TYPE.PLAN">
              {{ item.end }}
            </td>
			<td class="secondary mobile">
              {{
                item.price | priceTransform(currentExchangeRate) | numeralFormat
              }}
              {{ currentUnitCode }}
			  <br/>
              {{
                item.priceChild
                  | priceTransform(currentExchangeRate)
                  | numeralFormat
              }}
              {{ currentUnitCode }}
            </td>
            <td class="secondary deskop">
              {{
                item.price | priceTransform(currentExchangeRate) | numeralFormat
              }}
              {{ currentUnitCode }}
            </td>
            <td class="secondary deskop">
              {{
                item.priceChild
                  | priceTransform(currentExchangeRate)
                  | numeralFormat
              }}
              {{ currentUnitCode }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { TOUR_DEPARTURE_TYPE } from '~/utils/constants';
import ImagePlaneTrip from '~/assets/images/airplane-trip.svg?inline';

export default {
  components: {
    ImagePlaneTrip
  },

  props: {
    departureType: Number,
    schedule: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) =>
          ['start', 'end', 'price', 'priceChild'].every((key) => key in item)
        )
    }
  },

  computed: {
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode'])
  },

  created() {
    this.TOUR_DEPARTURE_TYPE = Object.freeze(TOUR_DEPARTURE_TYPE);
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/tour/_departure-schedule.scss';
</style>