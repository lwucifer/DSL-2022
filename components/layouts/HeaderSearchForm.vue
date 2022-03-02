<template>
  <div class="header_search-form">
    <!-- Khách sạn -->
    <div class="container-fluid" v-if="tab === 1">
      <div class="box">
        <div class="header_search-form_content">
          <div class="item flex-1">
            <SelectWithCheckbox
              class="w-100"
              :placeholder="$t('home.area')"
              size="lg"
              :options="selectAreas"
            >
              <IconPin slot="append" class="icon d-block" />
            </SelectWithCheckbox>
          </div>
          <div class="item flex-2">
            <AppDatePicker
              range
              size="lg"
              class="w-100"
              :placeholder="$t('hotel.check_schedule')"
            />
          </div>
          <div class="item flex-1">
            <v-select-dropdown size="lg">
              <template slot="selected"
                >{{ adults + children }} {{ $t('header.guest') }}
                <span class="mx-3">-</span> {{ rooms }}
                {{ $t('header.room') }}</template
              >
              <template slot="options">
                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <span class="mr-5">{{ $t('header.adults') }}</span>
                  <v-counter v-model="adults" />
                </v-select-dropdown-option>

                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <span class="mr-5">{{ $t('header.children_4') }}</span>
                  <v-counter v-model="children" />
                </v-select-dropdown-option>

                <v-select-dropdown-option
                  class="d-flex justify-content-between"
                >
                  <span class="mr-5">{{ $t('header.room') }}</span>
                  <v-counter v-model="rooms" />
                </v-select-dropdown-option>
              </template>
            </v-select-dropdown>
          </div>
          <div class="item flex-1">
            <v-select-dropdown size="lg">
              <template slot="selected">{{ $t('header.price') }}</template>

              <template slot="options">
                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <div class="w-100">
                    <div class="mb-3">
                      {{ $t('header.price_from') }}
                      <b class="primary ml-2 mr-2"
                        >{{ (range[0] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >{{ $t('header.come') }}
                      <b class="primary ml-2"
                        >{{ (range[1] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >
                    </div>
                    <v-range-slider
                      v-model="range"
                      class="mt-2"
                      :min="0"
                      :max="30"
                      :step="1"
                    />
                  </div>
                </v-select-dropdown-option>
              </template>
            </v-select-dropdown>
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              :placeholder="$t('hotel.rank')"
              :options="OPTIONS"
              size="lg"
            />
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              :placeholder="$t('hotel.type')"
              :options="OPTIONS"
              size="lg"
            />
          </div>
          <v-button class="btn-search" variant="primary" :loading="false"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <div class="header_search-form_bottom">
          <div class="result"><b>0</b> {{ $t('header.restaurants') }}</div>
          <div class="ml-auto">
            <span class="btn-reset">{{ $t('hotel.clear_filter_all') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Nhà hàng -->
    <div class="container" v-if="tab === 2">
      <div class="box">
        <div class="header_search-form_content">
          <div class="item flex-1">
            <SelectWithCheckbox
              class="w-100"
              :placeholder="$t('home.area')"
              size="lg"
              :options="selectAreas"
            >
              <IconPin slot="append" class="icon d-block" />
            </SelectWithCheckbox>
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              class="w-100"
              :placeholder="$t('home.type_food')"
              size="lg"
              :options="selectAreas"
            >
              <IconXmlid slot="append" class="icon d-block" />
            </SelectWithCheckbox>
          </div>
          <div class="item flex-1">
            <v-select-dropdown size="lg">
              <template slot="selected">{{
                $t('header.price_range')
              }}</template>
              <template slot="options">
                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <div class="w-100">
                    <div class="mb-3">
                      {{ $t('header.price_from') }}
                      <b class="primary ml-2 mr-2"
                        >{{ (range[0] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >{{ $t('header.come') }}
                      <b class="primary ml-2"
                        >{{ (range[1] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >
                    </div>
                    <v-range-slider
                      v-model="range"
                      class="mt-2"
                      :min="0"
                      :max="30"
                      :step="1"
                    />
                  </div>
                </v-select-dropdown-option>
              </template>
            </v-select-dropdown>
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              :placeholder="$t('restaurant.type_restaurant')"
              :options="OPTIONS"
              size="lg"
            />
          </div>
          <v-button class="btn-search" variant="primary" :loading="false"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <div class="header_search-form_bottom">
          <div class="result"><b>0</b> {{ $t('header.restaurants') }}</div>
          <div class="ml-auto">
            <span class="btn-reset">{{ $t('hotel.clear_filter_all') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tour du lịch -->
    <div class="container-fluid" v-if="tab === 3">
      <div class="box">
        <div class="header_search-form_content">
          <div class="item flex-1">
            <SelectWithCheckbox
              class="w-100"
              placeholder="Khu vực"
              size="lg"
              :options="selectAreas"
            >
              <IconPin slot="append" class="icon d-block" />
            </SelectWithCheckbox>
          </div>
          <div class="item flex-1">
            <v-select-dropdown size="lg">
              <template slot="selected">{{
                $t('header.price_range')
              }}</template>
              <template slot="options">
                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <div class="w-100">
                    <div class="mb-3">
                      {{ $t('header.price_from') }}
                      <b class="primary ml-2 mr-2"
                        >{{ (range[0] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >{{ $t('header.come') }}
                      <b class="primary ml-2"
                        >{{ (range[1] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >
                    </div>
                    <v-range-slider
                      v-model="range"
                      class="mt-2"
                      :min="0"
                      :max="30"
                      :step="1"
                    />
                  </div>
                </v-select-dropdown-option>
              </template>
            </v-select-dropdown>
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              class="w-100"
              :placeholder="$t('home.start_gate')"
              size="lg"
              :options="selectAreas"
            >
              <IconPin slot="append" class="icon d-block" />
            </SelectWithCheckbox>
          </div>
          <div class="item flex-1">
            <AppDatePicker
              size="lg"
              class="w-100"
              :placeholder="$t('home.time_gate')"
            />
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              placeholder="Thời gian"
              :options="OPTIONS"
              size="lg"
            />
          </div>
          <div class="item flex-1">
            <SelectWithCheckbox
              placeholder="Loại hình cửa hàng"
              :options="OPTIONS"
              size="lg"
            />
          </div>
          <v-button class="btn-search" variant="primary" :loading="false"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <div class="header_search-form_bottom">
          <div class="result"><b>0</b> {{ $t('header.restaurants') }}</div>
          <div class="ml-auto">
            <span class="btn-reset">{{ $t('hotel.clear_filter_all') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sản phẩm du lịch -->
    <div class="container" v-if="tab === 4">
      <div class="box">
        <div class="header_search-form_content">
          <div class="item flex-2">
            <input type="text" :placeholder="$t('product.search')" />
          </div>
          <div class="item flex-1">
            <v-select-dropdown size="lg">
              <template slot="selected">{{
                $t('header.price_range')
              }}</template>
              <template slot="options">
                <v-select-dropdown-option
                  class="d-flex justify-content-between mb-4"
                >
                  <div class="w-100">
                    <div class="mb-3">
                      {{ $t('header.price_from') }}
                      <b class="primary ml-2 mr-2"
                        >{{ (range[0] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >{{ $t('header.come') }}
                      <b class="primary ml-2"
                        >{{ (range[1] || 0) * 1000000 }} {{ currentUnitCode }}</b
                      >
                    </div>
                    <v-range-slider
                      v-model="range"
                      class="mt-2"
                      :min="0"
                      :max="30"
                      :step="1"
                    />
                  </div>
                </v-select-dropdown-option>
              </template>
            </v-select-dropdown>
          </div>
          <v-button class="btn-search" variant="primary" :loading="false"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <div class="header_search-form_bottom">
          <div class="result"><b>0</b> {{ $t('header.restaurants') }}</div>
          <div class="ml-auto">
            <span class="btn-reset">{{ $t('hotel.clear_filter_all') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
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

import { mapGetters } from 'vuex';

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
    IconAeroplane
  },

  data() {
    return {
      tab: 1,
      adults: 0,
      children: 0,
      rooms: 0,
      range: [0, 0],
      map: false
    };
  },

  created() {
    let options = [];
    for (let i = 0; i < 20; i++) {
      options.push({
        value: i,
        text: 'Option ' + (i + 1)
      });
    }
    this.OPTIONS = options;
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  },

  computed: {
    ...mapGetters('common/selectbox', ['selectAreas']),
    ...mapGetters('common/common', ['currentUnitCode']),
  }
};
</script>

<style lang="scss">
@import '~assets/scss/components/layouts/_header-search-form.scss';
</style>
