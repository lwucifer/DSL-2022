<template>
  <div class="container">
    <h1>Input</h1>
    <hr />

    <div class="mb-5">
      <h3>Input normal</h3>
      <v-input placeholder="Input something..." />
    </div>

    <div class="mb-5">
      <h3>Sizes of input</h3>

      <div>
        <v-input
          v-for="size in COMPONENT_SIZE_LIST"
          :key="size"
          :size="size"
          :value="'Input size ' + size"
          class="mb-3"
        />
      </div>
    </div>

    <div class="mb-5">
      <h3>Validation</h3>
      <v-input placeholder="Valid" class="mb-3" :valid="true"/>
      <v-input placeholder="Invalid" class="mb-3" :valid="false"/>
    </div>

    <div class="mb-5">
      <h3>Others</h3>

      <v-input value="Input disabled" class="mb-3" disabled />
      <v-input value="Input readonly" class="mb-3" readonly />
      <v-input value="Prepend & Append" class="mb-3" prepend="$" append=".00" />
    </div>
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';

export default {
  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  }
};
</script>

<style>
</style>