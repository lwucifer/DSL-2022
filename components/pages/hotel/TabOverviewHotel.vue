<template>
  <div class="tab-overview">
    <span>{{$t("hotel.type")}}: <strong class="secondary">{{ overViewHotel.type || ''}}</strong></span>
    <span>{{$t("hotel.rank")}}: <strong class="secondary">{{ overViewHotel.rank || ''}} {{$t("hotel.star")}}</strong></span>
    <span>{{$t("hotel.floor")}} <strong class="secondary">{{ overViewHotel.number_of_floor || '' }}</strong></span>
    <span>{{$t("hotel.time_chekin")}} <strong class="secondary">{{ splitTime(overViewHotel.checkin_time) }}</strong></span>
    <span>{{$t("hotel.time_checkout")}} <strong class="secondary">{{ splitTime(overViewHotel.checkout_time) }}</strong></span>
    <span>{{$t("hotel.phone_number")}} <strong class="secondary">{{ overViewHotel.phone || '' }}</strong></span>
    <span>{{$t("hotel.email")}} <strong class="secondary">{{ overViewHotel.email || '' }}</strong></span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { split, join } from 'lodash'

export default {
  name: 'TabOverviewHotel',
  
  computed: {
    ...mapState('hotel/hotel', [
      'hotel_detail'
    ]),

    overViewHotel () {
      if (!this.hotel_detail) return {}
      return this.hotel_detail.box_data || {}
    }
  },

  methods: {
    splitTime (time) {
      if (!time) return ''
      return join(split(time, ':', 2), ':')
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-overview {
  background-color: #E5ECF9;
  padding: 2.2rem 1.6rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  grid-gap: 1rem;
  span {
    font-size: $font-size-sm;
  }

  span:last-child {
    margin-right: 0;
  }

  @include media('>=md') {
    display: block;

    span {
      margin-right: 4.5rem;
    }
  }
}
</style>

