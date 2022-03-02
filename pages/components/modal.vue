<template>
  <div class="container">
    <h1>Modal</h1>
    <hr />

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="normalModal = true"
        >Click to open normal modal</v-button
      >
      <v-modal
        v-model="normalModal"
        title="Modal title"
        @cancel="normalModal = false"
        @ok="normalModal = false"
        @close="normalModal = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="staticModal = true"
        >Click to open static modal</v-button
      >
      <v-modal
        v-model="staticModal"
        static
        title="Modal static"
        @cancel="staticModal = false"
        @ok="staticModal = false"
        @close="staticModal = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="modalSm = true"
        >Click to open modal size sm</v-button
      >
      <v-modal
        v-model="modalSm"
        title="Modal sm"
        size="sm"
        @cancel="modalSm = false"
        @ok="modalSm = false"
        @close="modalSm = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="modalMd = true"
        >Click to open modal size md</v-button
      >
      <v-modal
        v-model="modalMd"
        title="Modal md"
        size="md"
        @cancel="modalMd = false"
        @ok="modalMd = false"
        @close="modalMd = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="modalLg = true"
        >Click to open modal size lg</v-button
      >
      <v-modal
        v-model="modalLg"
        title="Modal lg"
        size="lg"
        @cancel="modalLg = false"
        @ok="modalLg = false"
        @close="modalLg = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="modalXl = true"
        >Click to open modal size xl</v-button
      >
      <v-modal
        v-model="modalXl"
        title="Modal xl"
        size="xl"
        @cancel="modalXl = false"
        @ok="modalXl = false"
        @close="modalXl = false"
      >
        modal content
      </v-modal>
    </div>

    <div class="mb-3">
      <v-button class="mb-3" variant="primary" @click="modalCentered = true"
        >Click to open modal centered</v-button
      >
      <v-modal
        v-model="modalCentered"
        title="Modal centered"
        centered
        @cancel="modalCentered = false"
        @ok="modalCentered = false"
        @close="modalCentered = false"
      >
        modal content
      </v-modal>
    </div>
  </div>
</template>

<script>
import { COMPONENT_SIZE_LIST } from '~/utils/constants';

export default {
  data() {
    return {
      normalModal: false,
      staticModal: false,
      modalSm: false,
      modalMd: false,
      modalLg: false,
      modalXl: false,
      modalCentered: false,
    };
  },

  created() {
    this.COMPONENT_SIZE_LIST = COMPONENT_SIZE_LIST;
  }
};
</script>
