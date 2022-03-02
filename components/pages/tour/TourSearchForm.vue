<template>
  <CommonSearchForm
    class="tour-search-form"
    @showmap="(e) => $emit('showmap', e)"
    @reset="reset()"
    @submit="submit()"
    @sort="(e) => (orderBy = e)"
    :isFiltering="isFiltering"
    :propOrderBy="orderBy"
    fluid
    :mapFilter="false"
  >
    <template slot="search-count">
      <b class="color-primary pr-2">{{ totalTour }}</b> {{$t("home.tour")}}
    </template>
    <template slot="search-content">
      <div class="item flex-1">
        <SelectWithCheckbox
          v-model="area"
          class="w-100"
          :placeholder="$t('home.area')"
          size="lg"
          :options="selectProvince"
          mode="multiple"
        >
          <IconPin slot="append" class="icon d-block" />
        </SelectWithCheckbox>
      </div>
      <div class="item flex-1">
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
          v-model="startPlace"
          class="w-100"
          :placeholder="$t('home.start_gate')"
          size="lg"
          :options="selectAreas"
          mode="multiple"
        >
          <IconPin slot="append" class="icon d-block" />
        </SelectWithCheckbox>
      </div>
      <div class="item flex-1">
        <AppDatePicker
          v-model="startTime"
          :placeholder="$t('home.time_gate')"
          size="lg"
          :disabled-date="disableBeforeToday"
        />
      </div>
      <div class="item flex-1">
        <SelectWithCheckbox
          v-model="time"
          :placeholder="$t('tour.time')"
          :options="selectTourTimes"
          mode="multiple"
          size="lg"
        />
      </div>
      <div class="item flex-1">
        <SelectWithCheckbox
          v-model="type"
          :placeholder="$t('tour.type_travel_2')"
          :options="selectTourTypes"
          size="lg"
          mode="multiple"
        />
      </div>
    </template>
  </CommonSearchForm>
</template>

<script>
import { mapGetters } from 'vuex';
import { convertQueryValue } from '~/utils/common';
import { RANGE_SLIDER_VALUE } from '~/utils/constants';

import SelectWithCheckbox from '~/components/pages/common/SelectWithCheckbox';
import CommonSearchForm from '~/components/pages/common/CommonSearchForm';
import AppDatePicker from '~/components/app/AppDatePicker';
import AppCheckbox from '~/components/app/AppCheckbox';
import IconPin from '~/assets/icons/pin.svg?inline';
import IconFlight from '~/assets/icons/flight.svg?inline';
import IconChef from '~/assets/icons/chef.svg?inline';
import IconSchedule from '~/assets/icons/schedule.svg?inline';
import IconSearch from '~/assets/icons/search.svg?inline';
import IconXmlid from '~/assets/icons/xmlid.svg?inline';
import IconAeroplane from '~/assets/icons/aeroplane.svg?inline';
import RangePrice from '~/components/pages/common/RangePrice';

export default {
  components: {
    CommonSearchForm,
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
    RangePrice
  },

  data() {
    return {
      map: false,
      orderBy: null,
      area: [],
      rangePrice: [null, null],
      startPlace: [],
      startTime: null,
      time: [],
      type: []
    };
  },

  computed: {
    ...mapGetters('common/selectbox', [
      'selectAreas',
      'selectProvince',
      'selectTourTypes',
      'selectTourTimes'
    ]),
    ...mapGetters('tour/tour', ['totalTour']),

    isFiltering() {
      return Object.entries(this.$route.query).some((c) => {
        // check orderBy by default  === 1
        return c[0] === 'order_by' ? c[1] !== '1' : !!c[1]
      });
    }
  },

  created() {
    this.RANGE_SLIDER_VALUE = Object.freeze(RANGE_SLIDER_VALUE);
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        const maxPrice = convertQueryValue(query, 'to_price', null);

        this.orderBy = convertQueryValue(query, 'order_by', null);
        this.area = convertQueryValue(query, 'area', []);
        this.rangePrice = [
          convertQueryValue(query, 'from_price', null),
          maxPrice >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX_DISPLAY
            : maxPrice
        ];
        this.startPlace = convertQueryValue(query, 'start_place', []);
        this.startTime = convertQueryValue(query, 'start_time', null);
        this.time = convertQueryValue(query, 'time', []);
        this.type = convertQueryValue(query, 'type', []);
      }
    }
  },

  methods: {
    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today;
    },

    reset() {
      this.orderBy = null;
      this.area = [];
      this.rangePrice = [null, null];
      this.startPlace = [];
      this.startTime = null;
      this.time = [];
      this.type = [];

      this.$nextTick(this.submit);
    },

    submit() {
      const {
        orderBy,
        area,
        rangePrice,
        startPlace,
        startTime,
        time,
        type
      } = this;
      this.$emit('search', {
        orderBy,
        area,
        fromPrice: rangePrice[0],
        toPrice:
          rangePrice[1] >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX
            : rangePrice[1],
        startPlace,
        startTime,
        time,
        type
      });
    }
  }
};
</script>

<style lang="scss">
.tour-search-form .common_search-form_content > .items > .item {
  @include media(">=xl") {
    width: calc(#{(100%/6)} - 1.6rem);
  }
}
</style>