<template>
  <div class="container">
    <h1>Tooltip</h1>
    <hr />

    <div class="mb-5">
      <h3>Tooltip placements</h3>
      <v-tooltip
        v-for="placement in PLACEMENTS"
        class="ma-3"
        :key="placement"
        :placement="placement"
      >
        <v-button slot="activator" variant="primary"
          >Tooltip {{ placement }}</v-button
        >

        Tooltip content
      </v-tooltip>
    </div>

    <div class="mb-5">
      <v-tooltip trigger="click">
        <v-button slot="activator" variant="primary"
          >Tooltip trigger click</v-button
        >

        Tooltip content
      </v-tooltip>
    </div>

    <div class="mb-5">
      <v-tooltip :delay="500">
        <v-button slot="activator" variant="primary">Tooltip delay</v-button>

        Tooltip content
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  created() {
    this.PLACEMENTS = [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'right',
      'right-start',
      'right-end',
      'left',
      'left-start',
      'left-end'
    ];
  }
};
</script>