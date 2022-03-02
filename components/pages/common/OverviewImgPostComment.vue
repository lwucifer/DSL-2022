<template>
  <section class="overview-img-comment animated fadeIn">
    <div class="overview-img-comment__grid">
      <div
        v-for="(i, index) in images.slice(0, 6)"
        :key="index"
        class="overview-img-comment__grid-item"
        @click="(event) => handleClickImage(event, i, index)"
      >
        <template v-if="i && i.loading">
         <Progess></Progess>
        </template>

        <template v-else>
          <img
            :src="
              images[index] ? images[index].url : `/images/overview-img-${i}.png`
            "
            alt=""
          />
          <span v-if="images.length > 6 && index === 5" class="overview-img-comment__grid-num"
            >+{{ images.length - 6 }}</span
          >
          <IconTrash
            v-if="ableDelete"
            class="icon icon-trash"
            @click.stop="onDeleteImage(i)"
          />
        </template>
      </div>
    </div>

    <v-modal
      :width="1200"
      :title="title"
      :footer="false"
      :centered="true"
      :visible="modalGallery"
      modal-class="overview-img__modal-gallery"
      header-class="pa-16"
      body-class="px-16 pb-16 pt-0"
      @cancel="modalGallery = false"
    >
      <OverviewImgGallery
        :images="images"
        :default-index="modalGalleryDefaultIndex"
      />
    </v-modal>
  </section>
</template>

<script>
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import IconTrash from '~/assets/icons/trash.svg?inline';

import OverviewImgGallery from '~/components/pages/common/OverviewImgGallery';

export default {
  components: {
    IconPin,
    IconHeart,
    IconHeartFilled,
    OverviewImgGallery,
    IconTrash
  },

  props: {
    title: String,
    address: String,
    isFavorite: Boolean,
    ableDelete: {
      type: Boolean,
      default: true
    },
    btnBookingText: String,
    btnBookingLink: {
      type: [String, Object],
      default: ''
    },
    images: {
      type: Array,
      default: () => [],
      // validator: (value) =>
      //   value.every((item) => ['url', 'type', 'loading'].every((key) => key in item))
    },
    disableButtonBook: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      modalGallery: false,
      modalGalleryDefaultIndex: 0
    };
  },

  methods: {
    handleClickImage(event, item, index) {
      event.preventDefault();

      this.modalGallery = true;
      this.modalGalleryDefaultIndex = index;
    },

    onDeleteImage (img) {
      this.$emit('delete', img)
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_overview-img-post-comment.scss';
</style>
