<template>
  <v-modal
    :header="false"
    :footer="false"
    :width="800"
    centered
    size="lg"
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    modal-class="modal-booking-failed custom-booking"
  >
    <h3 class="text-center mb-24 mt-4">{{$t("restaurant.not_cancel_calendar")}}</h3>

    <div class="deep-dark body-1 my-5 text-center">
      {{$t("tour.just_left")}} <b>1</b> giờ <b>45</b> {{$t("restaurant.not_cancel_in_2h")}}
      <a
        class="fw-bold primary"
        href="tel:0911
      222 333"
        >0911 222 333</a
      >
      {{$t("tour.for_assistance")}}
    </div>

    <v-button class="w-100" size="lg" variant="primary">{{$t("restaurant.confirm")}}</v-button>

    <slot></slot>
  </v-modal>
</template>

<script>
export default {
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    visible: Boolean
  },

  data() {
    return {
      reason: 1
    };
  }
};
</script>

<style>
</style>