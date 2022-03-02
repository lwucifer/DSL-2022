<template>
  <div class="container">
    <h1>Slider</h1>
    <hr />

    <div class="mb-5">
      <div class="container">
        {{ slider }}
        <v-slider v-model="slider" />
      </div>
    </div>

    <div class="mb-5">
      <div class="container">
        {{ range[0] + ' - ' + range[1] }}
        <v-range-slider v-model="range" :min="0" :max="100" :step="1" />
      </div>
    </div>
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';

export default {
  data() {
    return {
      slider: 0,
      range: [0, 10]
    };
  },

  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  }
};
</script>