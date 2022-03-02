<template>
  <CommonSearchForm
    class="product-search-form"
    @showmap="(e) => $emit('showmap', e)"
    @reset="reset()"
    @submit="submit()"
    @sort="(e) => (orderBy = e)"
    :isFiltering="isFiltering"
    :propOrderBy="orderBy"
  >
    <template slot="search-count">
      <b class="color-primary pr-2">{{ totalProductTravel }}</b> {{$t("product.index")}}
    </template>
    <template slot="search-content">
      <div class="item flex-1">
        <v-input
          v-model="search"
          :placeholder="$t('product.search')"
          class="w-100"
          size="lg"
        />
      </div>

      <div class="item flex-1">
        <SelectWithCheckbox
          v-model="categories"
          class="w-100"
          :placeholder="$t('home.product_category')"
          size="lg"
          mode="multiple"
          :options="tourismProductCategory.map(item => ({ value: item.id, text: item.name }))"
        >
        </SelectWithCheckbox>
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
    </template>
  </CommonSearchForm>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
      rangePrice: [null, null],
      search: null,
      categories: []
    };
  },

  computed: {
    ...mapState('home/home', ['tourismProductCategory']),
    ...mapGetters('productTravel/productTravel', ['totalProductTravel']),

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

        this.search = convertQueryValue(query, 'search', null);
        this.orderBy = convertQueryValue(query, 'order_by', null);
        this.rangePrice = [
          convertQueryValue(query, 'from_price', null),
          maxPrice >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX_DISPLAY
            : maxPrice
        ];
        this.categories = convertQueryValue(query, 'categories', []);
      }
    }
  },

  methods: {
    reset() {
      this.orderBy = null;
      this.search = null;
      this.rangePrice = [null, null];
      this.categories = [];

      this.$nextTick(this.submit);
    },

    submit() {
      const { orderBy, search, rangePrice, categories } = this;
      this.$emit('search', {
        orderBy,
        search,
        fromPrice: rangePrice[0],
        toPrice:
          rangePrice[1] >= RANGE_SLIDER_VALUE.MAX_DISPLAY
            ? RANGE_SLIDER_VALUE.MAX
            : rangePrice[1],
        categories
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@include media(">=xl") {
  .item-range-slider {
    max-width: calc((100% - #{1.6rem * 3})/3);
  }
}
</style>
