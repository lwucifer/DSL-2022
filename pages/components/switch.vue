<template>
  <div class="container">
    <h1>Switch</h1>
    <hr />

    <div class="mb-5">
      <h3>Sizes of switch</h3>

      <div>
        <v-switch
          v-for="size in COMPONENT_SIZE_LIST"
          :key="size"
          :size="size"
          class="ma-3"
        />
      </div>
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
