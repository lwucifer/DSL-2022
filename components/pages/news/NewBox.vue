<template>
  <div class="new-box">
    <div class="new-box__img">
      <n-link :to="`/${defaultLangCode}/news/detail/${data.id}`"
        ><img :src="data.avatar_small" alt=""
      /></n-link>
      <!-- <div class="post-name">{{ data.post_name }}</div> -->
    </div>

    <div class="new-box__content">
      <n-link
        :to="`/${defaultLangCode}/news/detail/${data.id}`"
        class="content-title"
        >{{ data.post_name }}</n-link
      >
      <div class="mb-16 content-text" v-html="filterContent"></div>

      <v-button class="infor-views" size="sm">
        <IconClock style="margin-top: -2px" /> {{ data.create_time }}
      </v-button>

      <v-button class="infor-views" size="sm">
        <IconEye style="margin-top: -2px" /> {{ data.view_number }}
      </v-button>
    </div>
  </div>
</template>

<script>
import IconClock from '~/assets/icons/clock-2.svg?inline';
import IconEye from '~/assets/icons/eye-2.svg?inline';

import { mapGetters } from 'vuex';

export default {
  components: {
    IconClock,
    IconEye
  },

  props: {
    data: {
      type: [Object, Array]
    }
  },

  computed: {
    ...mapGetters('common/common', ['defaultLangCode']),

    filterContent() {
      if (process.browser) {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
          return this.data.content.slice(0, 100) + '...';
        } else {
          return this.data.content;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/news/_new-box.scss';
</style>