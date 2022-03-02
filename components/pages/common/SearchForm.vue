<template>
  <div class="home_search-form">
    <div class="container">
      <div class="box">
        <ul class="home_search-form_nav">
          <li v-if="menuPageTypes.includes(MENU_PAGE_TYPE.HOTEL)" class="item">
            <span @click="tab = 1" :class="tab === 1 ? 'active' : ''">
              <IconHotel class="icon" />
              <span class="text">{{ $t('home.hotel') }}</span>
            </span>
          </li>
          <li
            v-if="menuPageTypes.includes(MENU_PAGE_TYPE.RESTAURANT)"
            class="item"
          >
            <span @click="tab = 2" :class="tab === 2 ? 'active' : ''">
              <IconChef class="icon" />
              <span class="text">{{ $t('header.restaurants') }}</span>
            </span>
          </li>
          <li v-if="menuPageTypes.includes(MENU_PAGE_TYPE.TOUR)" class="item">
            <span @click="tab = 3" :class="tab === 3 ? 'active' : ''">
              <IconFlight class="icon" />
              <span class="text">{{ $t('home.tour') }}</span>
            </span>
          </li>
          <li
            v-if="menuPageTypes.includes(MENU_PAGE_TYPE.PRODUCT)"
            class="item"
          >
            <span @click="tab = 4" :class="tab === 4 ? 'active' : ''">
              <IconSchedule class="icon" />
              <span class="text">{{ $t('home.product_travel') }}</span>
            </span>
          </li>
        </ul>

        <!-- Khách sạn -->
        <div
          class="home_search-form_content"
          id="tab1"
          v-if="menuPageTypes.includes(MENU_PAGE_TYPE.HOTEL) && tab === 1"
        >
          <div class="items">
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
            <div class="item flex-2">
              <AppDatePicker
                size="lg"
                class="w-100"
                :placeholder="$t('hotel.check_schedule')"
                v-model="check_time"
                :disabled-date="disableBeforeToday"
                range
              />
            </div>
            <!-- <div class="item flex-2">
              <AppDatePicker
                size="lg"
                class="w-100"
                placeholder="Trả phòng"
                v-model="checkout_time"
                :disabled-date="disableBeforeTodayOut"
              />
            </div> -->
            <div class="item flex-1">
              <v-select-dropdown size="lg">
                <template slot="selected">
                  {{ number_adults + number_children }}
                  {{ $t('header.guest') }} <span class="mx-3">-</span>
                  {{ number_room }} {{ $t('header.room') }}
                </template>
                <template slot="options">
                  <v-select-dropdown-option
                    class="d-flex justify-content-between mb-4"
                  >
                    <span class="mr-5">{{ $t('header.adults') }}</span>
                    <v-counter v-model="number_adults" />
                  </v-select-dropdown-option>

                  <v-select-dropdown-option
                    class="d-flex justify-content-between mb-4"
                  >
                    <span class="mr-5">{{ $t('header.children_4') }}</span>
                    <v-counter v-model="number_children" />
                  </v-select-dropdown-option>

                  <v-select-dropdown-option
                    class="d-flex justify-content-between"
                  >
                    <span class="mr-5">{{ $t('header.room') }}</span>
                    <v-counter v-model="number_room" />
                  </v-select-dropdown-option>
                </template>
              </v-select-dropdown>
            </div>
          </div>
          <v-button
            class="btn-search"
            variant="primary"
            :loading="false"
            :data-mobile-text="$t('product.search')"
            @click="$emit('searchHotel', payloadHotel)"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <!-- Nhà hàng -->
        <div
          class="home_search-form_content"
          id="tab2"
          v-if="menuPageTypes.includes(MENU_PAGE_TYPE.RESTAURANT) && tab === 2"
        >
          <div class="items">
            <div class="item flex-1">
              <SelectWithCheckbox
                class="w-100"
                :placeholder="$t('home.area')"
                size="lg"
                :options="selectProvince"
                mode="multiple"
                v-model="area"
              >
                <IconPin slot="append" class="icon d-block" />
              </SelectWithCheckbox>
            </div>
            <div class="item flex-1">
              <SelectWithCheckbox
                class="w-100"
                :placeholder="$t('home.type_food')"
                size="lg"
                :options="selectDishTypes"
                mode="multiple"
                v-model="dishType"
              >
                <IconXmlid slot="append" class="icon d-block" />
              </SelectWithCheckbox>
            </div>
          </div>
          <v-button
            class="btn-search"
            variant="primary"
            :loading="false"
            :data-mobile-text="$t('product.search')"
            @click="$emit('searchRestaurant', payloadRestaurant)"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <!-- Tour du lịch -->
        <div
          class="home_search-form_content"
          id="tab3"
          v-if="menuPageTypes.includes(MENU_PAGE_TYPE.TOUR) && tab === 3"
        >
          <div class="items">
            <div class="item flex-1">
              <SelectWithCheckbox
                class="w-100"
                :placeholder="$t('home.start_gate')"
                size="lg"
                :options="selectAreas"
                mode="multiple"
                v-model="startPlace"
              >
                <IconAeroplane slot="append" class="icon d-block" />
              </SelectWithCheckbox>
            </div>

            <div class="item flex-1">
              <AppDatePicker
                size="lg"
                class="w-100"
                :placeholder="$t('home.time_gate')"
                v-model="start_time"
                :disabled-date="disableBeforeTodayTour"
              />
            </div>
          </div>
          <v-button
            class="btn-search"
            variant="primary"
            :loading="false"
            :data-mobile-text="$t('product.search')"
            @click="$emit('searchTour', payloadTour)"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <!-- Sản phẩm du lịch -->
        <div
          class="home_search-form_content"
          id="tab4"
          v-if="menuPageTypes.includes(MENU_PAGE_TYPE.PRODUCT) && tab === 4"
        >
          <div class="items">
            <div class="item flex-1">
              <SelectWithCheckbox
                v-model="categories"
                class="w-100"
                :placeholder="$t('home.product_category')"
                size="lg"
                mode="multiple"
                :options="
                  tourismProductCategory.map((item) => ({
                    value: item.id,
                    text: item.name
                  }))
                "
              >
              </SelectWithCheckbox>
            </div>
            <div class="item flex-1">
              <v-select-dropdown size="lg">
                <template slot="selected">
                  <template v-if="!range_price[0] && !range_price[1]">{{
                    $t('header.price_range')
                  }}</template>
                  <RangePrice v-else :range="range_price" />
                </template>

                <template slot="options">
                  <v-select-dropdown-option
                    class="d-flex justify-content-between mb-4"
                  >
                    <div class="select-range-content">
                      <RangePrice class="mb-3" :range="range_price" />
                      <v-range-slider
                        v-model="range_price"
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
          </div>
          <v-button
            class="btn-search"
            variant="primary"
            :loading="false"
            :data-mobile-text="$t('product.search')"
            @click="$emit('searchProductTravel', payloadProductTravel)"
            ><IconSearch class="icon"
          /></v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  COMPONENT_SIZE_LIST,
  RANGE_SLIDER_VALUE,
  MENU_PAGE_TYPE
} from '~/utils/constants';
import SelectWithCheckbox from '~/components/pages/common/SelectWithCheckbox';
import AppDatePicker from '~/components/app/AppDatePicker';
import RangePrice from '~/components/pages/common/RangePrice';
import IconPin from '~/assets/icons/pin.svg?inline';
import IconFlight from '~/assets/icons/flight.svg?inline';
import IconChef from '~/assets/icons/chef.svg?inline';
import IconSchedule from '~/assets/icons/schedule.svg?inline';
import IconSearch from '~/assets/icons/search.svg?inline';
import IconXmlid from '~/assets/icons/xmlid.svg?inline';
import IconAeroplane from '~/assets/icons/aeroplane.svg?inline';
import IconHotel from '~/assets/icons/hotel.svg?inline';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { convertQueryValue } from '~/utils/common';

export default {
  components: {
    SelectWithCheckbox,
    AppDatePicker,
    RangePrice,
    IconChef,
    IconFlight,
    IconSchedule,
    IconPin,
    IconSearch,
    IconXmlid,
    IconAeroplane,
    IconHotel
  },

  data() {
    return {
      tab: 1,
      map: null,
      startPlace: [],
      area: [],
      check_time: [null, null],
      range_price: [null, null],
      rank: [],
      type: [],
      number_adults: 0,
      number_children: 0,
      number_room: 0,
      start_time: null,
      time: [],
      dishType: [],
      range_price: [null, null],
      categories: []
    };
  },

  computed: {
    ...mapState('common/common', ['menuConfig']),
    ...mapState('home/home', ['tourismProductCategory']),
    ...mapGetters('common/common', ['currentExchangeRate', 'currentUnitCode']),
    ...mapGetters('common/selectbox', [
      'selectProvince',
      'selectDishTypes',
      'selectAreas'
    ]),

    payloadHotel() {
      return {
        area: this.area,
        checkin_time: this.check_time[0],
        checkout_time: this.check_time[1],
        from_price: this.range_price[0],
        to_price: this.range_price[1],
        rank: this.rank,
        type: this.type,
        number_adults: this.number_adults,
        number_children: this.number_children,
        number_room: this.number_room
      };
    },

    payloadTour() {
      return {
        area: this.area,
        startPlace: this.startPlace,
        from_price: this.range_price[0],
        to_price: this.range_price[1],
        start_time: this.start_time,
        time: this.time,
        type: this.type
      };
    },

    payloadRestaurant() {
      return {
        area: this.area,
        dish_type: this.dishType
      };
    },

    payloadProductTravel() {
      return {
        categories: this.categories,
        from_price: this.range_price[0],
        toPrice:
          this.range_price[1] >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX
            : this.range_price[1]
      };
    },

    menuPageTypes() {
      if (!this.menuConfig) return [];
      return this.menuConfig.map((item) => item.page_type);
    }
  },

  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
    this.RANGE_SLIDER_VALUE = Object.freeze(RANGE_SLIDER_VALUE);
    this.MENU_PAGE_TYPE = Object.freeze(MENU_PAGE_TYPE);
  },

  watch: {
    '$route.query': {
      immediate: true,
      handler(query) {
        this.area = convertQueryValue(query, 'area', []);
        this.startPlace = convertQueryValue(query, 'startPlace', []);
        this.range_price = [
          convertQueryValue(query, 'from_price', null),
          convertQueryValue(query, 'to_price', null)
        ];
        this.start_time = convertQueryValue(query, 'start_time', null);
        this.time = convertQueryValue(query, 'time', []);
        this.type = convertQueryValue(query, 'type', []);
      }
    }
  },

  methods: {
    ...mapMutations('common/selectbox', []),

    submit() {
      const { area, range_price, start_time, time, type } = this;
      this.$emit('search', {
        area,
        startPlace,
        from_price: range_price[0],
        to_price: range_price[1],
        start_time,
        time,
        type
      });
    },

    disableBeforeTodayTour(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today;
    },

    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today;
    },

    disableBeforeToday(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/common/_home-search-form.scss';
</style>
