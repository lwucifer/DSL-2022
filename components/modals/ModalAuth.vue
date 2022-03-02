<template>
  <v-modal
    :header="false"
    :footer="false"
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    modal-class="modal-auth"
     @cancel="$emit('cancel')"
  >
    <!-- <span class="modal-auth-close" @click="$emit('cancel')">
      <span></span>
    </span> -->

    <slot />
  </v-modal>
</template>

<script>
export default {
  name: 'ModalAuth',
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    visible: Boolean
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/modals/_modal-auth.scss';
</style>