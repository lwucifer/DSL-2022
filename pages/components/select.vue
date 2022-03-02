<template>
  <div class="container">
    <h1>Select</h1>
    <hr />

    <div class="mb-5">
      <h3>Select normal</h3>
      <v-select placeholder="Select something..." :options="OPTIONS" />
    </div>

    <div class="mb-5">
      <h3>Sizes of select</h3>

      <div>
        <v-select
          v-for="size in COMPONENT_SIZE_LIST"
          :key="size"
          :size="size"
          :placeholder="'Select size ' + size"
          :options="OPTIONS"
          class="ma-2"
        />
      </div>
    </div>

    <div class="mb-5">
      <h3>Validation</h3>
      <v-select
        placeholder="Valid"
        class="ma-2"
        :valid="true"
        :options="OPTIONS"
      />
      <v-select
        placeholder="Invalid"
        class="ma-2"
        :valid="false"
        :options="OPTIONS"
      />
    </div>

    <div class="mb-5">
      <h3>Others</h3>

      <v-select
        placeholder="Select disabled"
        class="ma-2"
        :options="OPTIONS"
        disabled
      />
    </div>

    <div class="mb-5">
      <h3>Select with checkbox</h3>

      <div class="row">
        <div class="col-md-3">
          <SelectWithCheckbox
            class="w-100 mb-4"
            placeholder="Khu vực"
            size="lg"
            :options="LOCATION_OPTIONS"
          >
            <IconPin slot="append" class="icon d-block" />
          </SelectWithCheckbox>
        </div>

        <div class="col-md-3">
          <SelectWithCheckbox
            class="w-100"
            mode="multiple"
            placeholder="Khu vực"
            size="lg"
            :options="LOCATION_OPTIONS"
          >
            <IconPin slot="append" class="icon d-block" />
          </SelectWithCheckbox>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <h3>Select with counter</h3>
      <v-select-dropdown size="lg">
        <template slot="selected"
          >{{ adults + children }} Khách <span class="mx-3">-</span>
          {{ rooms }} Phòng</template
        >

        <template slot="options">
          <v-select-dropdown-option class="d-flex justify-content-between mb-4">
            <span class="mr-5">Người lớn</span>
            <v-counter v-model="adults" />
          </v-select-dropdown-option>

          <v-select-dropdown-option class="d-flex justify-content-between mb-4">
            <span class="mr-5">Trẻ em < 4 tuổi</span>
            <v-counter v-model="children" />
          </v-select-dropdown-option>

          <v-select-dropdown-option class="d-flex justify-content-between">
            <span class="mr-5">Phòng</span>
            <v-counter v-model="rooms" />
          </v-select-dropdown-option>
        </template>
      </v-select-dropdown>
    </div>

    <div class="mb-5">
      <h3>Select width range slider</h3>

      <v-select-dropdown size="lg" style="width: 600px">
        <template slot="selected">
          <template v-if="!range[0] && !range[1]">Mức giá</template>
          <template v-else>
            Từ
            <b class="primary ml-2 mr-3">{{ (range[0] || 0) * 1000000 }} VND</b>
            đến
            <b class="primary ml-2">{{ (range[1] || 0) * 1000000 }} VND</b>
          </template>
        </template>

        <template slot="options">
          <v-select-dropdown-option class="d-flex justify-content-between mb-4">
            <div class="w-100">
              <div class="mb-3">
                Giá từ
                <b class="primary ml-2 mr-3"
                  >{{ (range[0] || 0) * 1000000 }} VND</b
                >
                đến
                <b class="primary ml-2">{{ (range[1] || 0) * 1000000 }} VND</b>
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
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import SelectWithCheckbox from '~/components/pages/common/SelectWithCheckbox';
import IconPin from '~/assets/icons/pin.svg?inline';

import { mapGetters } from 'vuex';

export default {
  components: {
    SelectWithCheckbox,
    IconPin
  },

  data() {
    return {
      adults: 0,
      children: 0,
      rooms: 0,
      range: [0, 0]
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
    this.LOCATION_OPTIONS = [
      {
        value: 'hn',
        text: 'Hà Nội'
      },
      {
        value: 'hp',
        text: 'Hải Phòng'
      },
      {
        value: 'hcm',
        text: 'TP Hồ Chí Minh'
      },
      {
        value: 'dn',
        text: 'Đà Nẵng'
      },
      {
        value: 'kv1',
        text: 'Khu vực 1'
      },
      {
        value: 'kv2',
        text: 'Khu vực 2'
      },
      {
        value: 'kv3',
        text: 'Khu vực 3'
      },
      {
        value: 'kv4',
        text: 'Khu vực 4'
      }
    ];
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  },

  computed: {
    ...mapGetters('common/selectbox', ['selectAreas'])
  }
};
</script>

<style>
</style>