<template>
  <CommonSearchForm
    @showmap="(e) => $emit('showmap', e)"
    @reset="reset()"
    @submit="submit()"
    @sort="(e) => (orderBy = e)"
    :isFiltering="isFiltering"
    :propOrderBy="orderBy"
    fluid
  >
    <template slot="search-count">
      <b class="color-primary pr-2">{{ totalHotel }}</b> {{$t("home.hotel")}}
    </template>
    <template slot="search-content">
      <div class="item flex-1">
        <SelectWithCheckbox
          class="w-100"
          :placeholder="$t('home.area')"
          size="lg"
          :options="selectProvince"
          v-model="area"
          mode="multiple"
        >
          <IconPin slot="append" class="icon d-block" />
        </SelectWithCheckbox>
      </div>
      <div class="item flex-1">
        <AppDatePicker
          size="lg"
          class="w-100"
          :placeholder="$t('hotel.check_schedule')"
          v-model="check_time"
          :disabled-date="disableBeforeToday"
          range
        />
        <!-- <AppDatePicker
            size="lg"
            class="w-100"
            placeholder="Trả phòng"
            v-model="checkout_time"
            :disabled-date="disableBeforeTodayOut"
            range
          /> -->
      </div>
      <div class="item flex-1">
        <v-select-dropdown size="lg">
          <template slot="selected"
            >{{ number_adults + number_children }} {{$t("header.guest")}}
            <span class="mx-3">-</span> {{ number_room || 0 }} {{$t("header.room")}}</template
          >
          <template slot="options">
            <v-select-dropdown-option
              class="d-flex justify-content-between mb-4"
            >
              <span class="mr-5">{{$t("header.adults")}}</span>
              <v-counter v-model="number_adults" />
            </v-select-dropdown-option>

            <v-select-dropdown-option
              class="d-flex justify-content-between mb-4"
            >
              <span class="mr-5">{{$t("header.children_4")}}</span>
              <v-counter v-model="number_children" />
            </v-select-dropdown-option>

            <v-select-dropdown-option class="d-flex justify-content-between">
              <span class="mr-5">{{$t("header.room")}}</span>
              <v-counter v-model="number_room" />
            </v-select-dropdown-option>
          </template>
        </v-select-dropdown>
      </div>
      <div class="item flex-1 item-range-slider">
        <v-select-dropdown size="lg">
          <template slot="selected">
            <div v-if="!rangePrice[0] && !rangePrice[1]">{{
              $t('header.price_range')
            }}</div>
            <v-tooltip v-else class="d-block" placement="top" :max-width="290">
              <RangePrice slot="activator" :range="rangePrice" />
              <RangePrice :range="rangePrice" :truncate="false" />
            </v-tooltip>
          </template>
          <template slot="options">
            <v-select-dropdown-option
              class="d-flex justify-content-between mb-4"
            >
              <div class="select-range-content">
                <RangePrice class="mb-3" :range="rangePrice" />
                <v-range-slider
                  v-model="rangePrice"
                  class="mt-2"
                  :min="RANGE_SLIDER_VALUE.MIN"
                  :max="RANGE_SLIDER_VALUE.MAX_DISPLAY"
                  :step="RANGE_SLIDER_VALUE.STEP"
                />
              </div>
            </v-select-dropdown-option>
          </template>
        </v-select-dropdown>
      </div>
      <div class="item flex-1">
        <SelectWithCheckbox
          :placeholder="$t('hotel.rank')"
          :options="selectRatings"
          isRating
          mode="multiple"
          size="lg"
          v-model="rank"
        />
      </div>
      <div class="item flex-1">
        <SelectWithCheckbox
          :placeholder="$t('hotel.type')"
          :options="selectHotelTypes"
          size="lg"
          mode="multiple"
          v-model="type"
        />
      </div>
    </template>
  </CommonSearchForm>
</template>

<script>
import { COMPONENT_SIZE_LIST, RANGE_SLIDER_VALUE } from '~/utils/constants';
import SelectWithCheckbox from '~/components/pages/common/SelectWithCheckbox';
import AppDatePicker from '~/components/app/AppDatePicker';
import AppCheckbox from '~/components/app/AppCheckbox';
import IconPin from '~/assets/icons/pin.svg?inline';
import IconFlight from '~/assets/icons/flight.svg?inline';
import IconChef from '~/assets/icons/chef.svg?inline';
import IconSchedule from '~/assets/icons/schedule.svg?inline';
import IconSearch from '~/assets/icons/search.svg?inline';
import IconXmlid from '~/assets/icons/xmlid.svg?inline';
import IconAeroplane from '~/assets/icons/aeroplane.svg?inline';
import CommonSearchForm from '~/components/pages/common/CommonSearchForm';
import RangePrice from '~/components/pages/common/RangePrice';

import { mapGetters } from 'vuex';
import { convertQueryValue } from '~/utils/common';

export default {
  components: {
    SelectWithCheckbox,
    AppDatePicker,
    AppCheckbox,
    IconChef,
    IconFlight,
    IconSchedule,
    IconPin,
    IconSearch,
    IconXmlid,
    IconAeroplane,
    CommonSearchForm,
    RangePrice
  },

  data() {
    return {
      tab: 1,
      map: null,
      order_by: [],
      area: [],
      check_time: [null, null],
      rangePrice: [null, null],
      rank: [],
      type: [],
      number_adults: null,
      number_children: null,
      number_room: null
    };
  },

  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
    this.RANGE_SLIDER_VALUE = Object.freeze(RANGE_SLIDER_VALUE);
  },

  computed: {
    ...mapGetters('common/selectbox', [
      'selectProvince',
      'selectRatings',
      'selectHotelTypes',
      'selectAreas'
    ]),
    ...mapGetters('hotel/hotel', ['totalHotel']),

    isFiltering() {
      return Object.entries(this.$route.query).some((c) => {
        // check orderBy by default  === 1
        return c[0] === 'order_by' ? c[1] !== '1' : !!c[1]
      });
    }
  },

  methods: {
    submit() {
      const {
        orderBy,
        area,
        check_time,
        rangePrice,
        rank,
        type,
        number_adults,
        number_children,
        number_room
      } = this;
      this.$emit('search', {
        orderBy,
        area,
        checkin_time: check_time[0],
        checkout_time: check_time[1],
        fromPrice: rangePrice[0],
        toPrice:
          rangePrice[1] >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX
            : rangePrice[1],
        rank,
        type,
        number_adults,
        number_children,
        number_room
      });
    },
    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },

    reset() {
      this.orderBy = null;
      this.area = [];
      this.check_time = [null, null];
      this.rangePrice = [null, null];
      this.rank = [];
      this.type = [];
      this.number_adults = null;
      this.number_children = null;
      this.number_room = null;

      this.$nextTick(() => {
        this.submit()
      });
    }
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        const maxPrice = convertQueryValue(query, 'to_price', null);
        this.orderBy = convertQueryValue(query, 'order_by', null);
        this.area = convertQueryValue(query, 'area', []);
        this.check_time = [
          convertQueryValue(query, 'checkin_time', null),
          convertQueryValue(query, 'checkout_time', null)
        ];
        this.rangePrice = [
          convertQueryValue(query, 'from_price', null),
          maxPrice >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX_DISPLAY
            : maxPrice
        ];
        this.rank = convertQueryValue(query, 'rank', []);
        this.type = convertQueryValue(query, 'type', []);
        this.number_adults = convertQueryValue(query, 'number_adults', null);
        this.number_children = convertQueryValue(
          query,
          'number_children',
          null
        );
        this.number_room = convertQueryValue(query, 'number_room', null);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@include media(">=xl") {
  .item-range-slider {
    max-width: calc((100% - #{1.6rem * 6})/6);
  }
}
</style>