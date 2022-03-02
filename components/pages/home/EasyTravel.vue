<template>
  <div class="easy-travel" :style="{'background-image': `url('${video.video_thumbnail}')`}">
    <div class="easy-travel__inside">
      <a href="" target="_blank" class="link-video" @click.prevent="openVideo">
        {{$t("home.watch_video")}} <span><IconPlay class="icon" /></span>
      </a>
    </div>

    <v-modal
      v-model="show"
      :header="false"
      :footer="false"
      :width="800"
      size="lg"
      centered
      @cancel="closeVideo"
    >
      <div class="text-center">
        <iframe
          v-if="video.video_url_type == 0"
          id="myVideo"
          class="video d-block"
          type="text/html"
          :height="800 / (16 / 9)"
          :src="`https://www.youtube.com/embed/${getYouTubeId(
            video.video_url
          )}`"
          frameborder="0"
        ></iframe>

       <video autoplay playsinline
          controls
          v-else
          ref="videoRef"
          :src="video.video_url" 
          id="myVideo"
          :poster="video.video_thumbnail"
        ></video>
      </div>
    </v-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconPlay from '~/assets/icons/play.svg?inline';

export default {
  components: {
    IconPlay
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    ...mapState('home/home', ['video'])
  },

  methods: {
    openVideo() {
      this.show = true;
    },

    closeVideo() {
      this.show = false;
      const video  =  document.getElementById("myVideo");

      if(video && this.video.video_url_type == 1){
        video.pause();
      }else if(video && this.video.video_url_type == 0) {
        let iframeSrc = video.src;
        video.src = iframeSrc
      }
    },

    getYouTubeId(url) {
      const arr = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      return undefined !== arr[2] ? arr[2].split(/[^\w-]/i)[0] : arr[0];
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/home/_easy-travel.scss';
</style>

<style lang="scss">
  video, .video {
    width: 100%;
    margin-top: 0.7rem;
  }
</style>
