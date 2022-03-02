<template>
  <div class="container">
    <h1>Popover</h1>
    <hr />

    <div class="mb-5">
      <h3>Popover placements</h3>
      <v-popover
        v-for="placement in PLACEMENTS"
        class="ma-3"
        :key="placement"
        :placement="placement"
        :title="`Popover ${placement}`"
      >
        <v-button slot="activator" variant="primary"
          >Popover {{ placement }}</v-button
        >

        Popover content
      </v-popover>
    </div>

    <div class="mb-5">
      <v-popover :delay="500">
        <v-button slot="activator" variant="primary">Popover delay</v-button>

        Popover content
      </v-popover>
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