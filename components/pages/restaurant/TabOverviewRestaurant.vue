<template>
  <div class="tab-overview restaurant-overview">
    <span>{{$t("header.price_range")}}: <strong class="secondary">
      {{get(restaurantDetail, 'box_data.from_price', '0') | priceTransform(currentExchangeRate) | numeralFormat}} - 
      {{get(restaurantDetail, 'box_data.to_price', '0') | priceTransform(currentExchangeRate) | numeralFormat}} 
      {{ currentUnitCode }}/{{$t("hotel.people")}}
    </strong></span>
    <span>{{$t("restaurant.type_dish")}}: <strong class="secondary">{{get(restaurantDetail, 'box_data.type_of_dish', '')}}</strong></span>
    <span>{{$t("hotel.phone_number")}} <strong class="secondary">{{get(restaurantDetail, 'box_data.phone', '')}}</strong></span>
    <span>{{$t("hotel.email")}} <strong class="secondary">{{get(restaurantDetail, 'box_data.email', '')}}</strong></span>
    <div class="hover-box">
      {{$t("restaurant.open_time")}}: 
      
      <div>
        <span class="hover-icon"><strong class="secondary pl-1">{{getOpenTime}}</strong> <IconInfo class="icon fill-primary"/></span>
      <div class="hover-content">
        <strong>{{$t('restaurant.all_week')}}</strong>
        <div class="row">
          <div class="col-6">
            <span>{{$t("tour.monday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.mo', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.friday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.fr', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.tuesday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.tu', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.saturday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.sa', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.wenesday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.we', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.sunday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.su', '').replace("|", " - ")}}</strong>
          </div>
          <div class="col-6">
            <span>{{$t("tour.thursday")}}: </span><strong class="secondary">{{get(this.restaurantDetail, 'box_data.open_time.th', '').replace("|", " - ")}}</strong>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconInfo from '~/assets/icons/info.svg?inline';

import {get} from 'lodash';
import { mapGetters } from 'vuex';
const STORE_NAMESPACE = "restaurant/restaurant";

export default {
  components: {
    IconInfo,
  },
  computed: {
    ...mapGetters('common/common', ['currentExchangeRate','currentUnitCode']),
    ...mapGetters(STORE_NAMESPACE, ['restaurantDetail']),
    getOpenTime() {
      let day = (new Date()).getDay();
      switch (day) {
        case 1:
          return get(this.restaurantDetail, 'box_data.open_time.mo', '').replace("|", " - ")
          break;
        case 2:
          return get(this.restaurantDetail, 'box_data.open_time.tu', '').replace("|", " - ")
          break;
        case 3:
          return get(this.restaurantDetail, 'box_data.open_time.we', '').replace("|", " - ")
          break;
        case 4:
          return get(this.restaurantDetail, 'box_data.open_time.th', '').replace("|", " - ")
          break;
        case 5:
          return get(this.restaurantDetail, 'box_data.open_time.fr', '').replace("|", " - ")
          break;
        case 6:
          return get(this.restaurantDetail, 'box_data.open_time.sa', '').replace("|", " - ")
          break;
        case 7:
          return get(this.restaurantDetail, 'box_data.open_time.su', '').replace("|", " - ")
          break;
        default:
          return get(this.restaurantDetail, 'box_data.open_time.mo', '').replace("|", " - ")
          break;
      }
    },
  },
  methods: {
    get,
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/restaurant/_tab-overview-restaurant.scss";
</style>
