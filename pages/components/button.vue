<template>
  <div class="container">
    <h1>Button</h1>
    <hr />

    <div class="mb-5">
      <h3>Normal buttons</h3>

      <div>
        <v-button
          v-for="variant in [...THEME_VARIANT_LIST, 'link']"
          :key="variant"
          class="ma-2"
          :variant="variant"
        >{{ variant.slice(0, 1).toUpperCase() + variant.slice(1) }}</v-button>
      </div>

      <div>
        <v-button
          v-for="variant in [...THEME_VARIANT_LIST, 'link']"
          :key="variant"
          class="ma-2"
          :variant="variant"
          loading
        >{{ variant.slice(0, 1).toUpperCase() + variant.slice(1) }}</v-button>
      </div>
    </div>

    <div class="mb-5">
      <h3>Outline buttons</h3>

      <div>
        <v-button
          v-for="variant in THEME_VARIANT_LIST"
          :key="variant"
          class="ma-2"
          :variant="'outline-' + variant"
        >{{ variant.slice(0, 1).toUpperCase() + variant.slice(1) }}</v-button>
      </div>
      
      <div>
        <v-button
          v-for="variant in THEME_VARIANT_LIST"
          :key="variant"
          class="ma-2"
          :variant="'outline-' + variant"
          loading
        >{{ variant.slice(0, 1).toUpperCase() + variant.slice(1) }}</v-button>
      </div>

    </div>

    <div class="mb-5">
      <h3>Button sizes</h3>

      <div>
        <v-button
          v-for="size in COMPONENT_SIZE_LIST"
          :key="size"
          :size="size"
          class="ma-2"
          variant="primary"
        >{{ 'Button ' + size }}</v-button>
      </div>

      <div>
        <v-button
          v-for="size in COMPONENT_SIZE_LIST"
          :key="size"
          class="ma-2"
          :size="size"
          variant="primary"
          loading
        >{{ 'Button ' + size }}</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { THEME_VARIANT_LIST, COMPONENT_SIZE_LIST } from '~/utils/constants';

export default {
  created() {
    this.THEME_VARIANT_LIST = THEME_VARIANT_LIST;
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  }
};
</script>
