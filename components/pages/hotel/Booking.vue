<template>
  <div class="booking">
    <h5 class="booking__title deep-dark">{{$t("hotel.restroom")}}</h5>

    <div class="booking__intro mb-3">
      {{$t("hotel.time_stay_hotel")}}
    </div>

    <div class="booking__datepicker">
      <AppDatePicker
        :placeholder="$t('hotel.checkin')"
        class="w-100"
        :disabled-date="disableBeforeToday"
        v-model="checkin_time"
      />
      <AppDatePicker
        :placeholder="$t('hotel.checkout')"
        class="w-100"
        :disabled-date="disableBeforeTodayOut"
        v-model="checkout_time"
      />
    </div>

    <div class="booking__room">
      <div class="room" v-for="(room, key) in data" :key="key">
        <div class="room-img">
          <OverviewImg
            class="overview-img-room"
            typeService="hotel"
            :title="get(room, 'room_type', '')"
            :status="1"
            :images="images || []"
          />
        </div>

        <div class="room-info">
          <h4 class="room-info__name">{{ room.room_type || '' }}</h4>

          <div class="room-info__capacity">
            <p>{{$t("hotel.area")}} {{ room.acreage }} m2</p>
            <p>{{$t("hotel.bed")}} {{ room.bed_type }}</p>
            <p>{{$t("hotel.capacity")}} {{ room.number_adults + room.number_children }} {{$t("hotel.person")}}</p>
          </div>

          <div class="room-info__equipment">
            <div
              class="secondary"
              v-for="(service, key) in services"
              :key="key"
            >
              <img
                class="img-icon"
                :src="service.icon"
                :alt="service.name"
                :class="service.enable == 0 ? 'disbale' : ''"
                v-if="service.icon"
              />
              <p class="mb-0"> {{ service.name || '' }} </p>
            </div>
          </div>

          <p>
            <span class="heading-4 secondary fw-bold">{{
              room.price | priceTransform(currentExchangeRate) | numeralFormat
            }}</span>
            <span>{{ currentUnitCode }}/{{$t("hotel.night")}}</span>
          </p>
          <p class="deep-dark fw-bold" v-if="availabelRooms(room) === 1">
            {{$t("hotel.only_single_room")}}
          </p>
          <p class="danger fw-bold" v-if="availabelRooms(room) === 0">
            {{$t("hotel.out_of_room")}}
          </p>

          <v-button
            @click="bookRestRoom(room)"
            :variant="availabelRooms(room) === 0 ? 'dark' : 'primary'"
            v-if="!disabled && !checkHideButton && availabelRooms(room)"
            :disabled="disabled"
            class="room-info__btn"
            >{{$t("hotel.book_now")}}</v-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppDatePicker from '~/components/app/AppDatePicker';
import IconTivi from '~/assets/icons/television.svg?inline';
import IconBench from '~/assets/icons/bench.svg?inline';
import IconBath from '~/assets/icons/bathtub.svg?inline';
import IconBed from '~/assets/icons/single-bed.svg?inline';
import { get } from 'lodash';
import { convertQueryValue } from '~/utils/common';

import { mapGetters } from 'vuex';

export default {
  name: 'HotelRestRooms',

  components: {
    AppDatePicker,
    IconTivi,
    IconBench,
    IconBath,
    IconBed
  },

  props: {
    data: {
      type: Array,
      default: () => []
    },

    services: {
      type: Array,
      default: () => []
    },

    disabled: {
      type: Boolean,
      default: false
    },

    images: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      checkin_time: null,
      checkout_time: null
    };
  },

  computed: {
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode', 'defaultLangCode']),
    checkHideButton() {
      return this.checkin_time != null && this.checkout_time != null
        ? false
        : true;
    }
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        this.checkin_time = convertQueryValue(
          query,
          'checkin_time',
          this.$moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
        );
        this.checkout_time = convertQueryValue(query, 'checkout_time', null);
      }
    },

    checkin_time (newVal) {
      if (newVal) {
        this.$emit('range', { check_in: newVal, check_out: this.checkout_time })
      }
    },

    checkout_time (newVal) {
      if (newVal) {
        this.$emit('range', { check_in: this.checkin_time, check_out: newVal })
      }
    } 
  },

  methods: {
    get,

    availabelRooms(_room) {
      const availableR =
      _room.hasOwnProperty('room_available')
      ? _room.room_available
      : (_room.room_number - _room.room_number_used);
      return availableR
    },

    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (this.checkout_time === null) {
        return date < today;
      } else {
        const dateDisable = this.$moment(
          this.checkout_time,
          'DD/MM/YYYY HH:mm:ss'
        ).format('MM-DD-YYYY HH:mm:ss');

        return date < today || date > Date.parse(dateDisable.replace(/-/g, '/').replace(/[a-z]+/gi, ' '))
      }
    },

    disableBeforeTodayOut(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (this.checkin_time === null) {
        return date < today;
      } else {
        const dateDisable = this.$moment(
          this.checkin_time,
          'DD/MM/YYYY HH:mm:ss'
        ).format('MM-DD-YYYY HH:mm:ss');
        return date < today || date < Date.parse(dateDisable.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
      }
    },

    bookRestRoom(_room) {
      const number_room_available =
      _room.hasOwnProperty('room_available')
      ? _room.room_available
      : 0;
      this.$router.push({
        path: `/${this.defaultLangCode}/booking/hotel/review`,
        query: {
          hotel_id: get(this.$route, 'params.id', ''),
          room_id: _room.rest_room_id,
          start_date: this.checkin_time,
          end_date: this.checkout_time,
          number_room_booked: 1,
          number_person_booked: 1,
          number_room_available
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/hotel/_booking.scss';
</style>