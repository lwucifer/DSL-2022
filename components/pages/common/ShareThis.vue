<template>
  <client-only>
    <v-modal
      :header="false"
      :footer="false"
      v-bind="{ ...$props, ...$attrs }"
      v-on="$listeners"
      modal-class="modal-auth modal-share-this"
      @cancel="$emit('cancel')"
    >
      <!-- <span class="modal-auth-close" @click="$emit('cancel')">
        <span></span>
      </span> -->
      <div class="share-this animated fadeIn">
        <h5 class="color-primary mb-3">
          {{$t("hotel.sharing_friend")}}
        </h5>
        
        <div class="sharethis-inline-share-buttons animated fadeIn" 
            :data-url="url" 
            :data-title="title"
            :data-description="description"
            :data-image="image"
            :data-tag="tag"
        ></div>
      </div>
    </v-modal>
  </client-only>
</template>

<script>
export default {
    model: {
      prop: 'visible',
      event: 'visibleChange'
    },
    props: {
        visible: Boolean,
        url: String,
        title: String,
        description: String,
        image: String,
        tag: String,
    },
    watch: {
      visible() {
        this.loadScript()
      }
    },
    created() {
      this.loadScript()
    },

    methods: {
      loadScript() {
        setTimeout(() => {
          if (process.browser){
            const st = window.__sharethis__
            if (!st) {
              const script = document.createElement('script')
              script.src =
                'https://platform-api.sharethis.com/js/sharethis.js#property=58fef6954f5c8200144c7adb&product=inline-share-buttons'
              document.body.appendChild(script)
            } else if (typeof st.initialize === 'function') {
              st.href = window.location.href
              st.initialize()
            }
          }
        }, 200);
      }
    }
}
</script>

<style lang="scss">
  .modal-auth-close {
    z-index: 9;
  }

  .share-this {
    margin-bottom: 0.5em;

    h5 {
      display: inline-block;
    }
  }

  .st-btn {
    display: inline-block !important;
    margin-bottom: 8px !important;

    &:hover {
      top: 0 !important;
    }
    span {
      display: inline-block !important;
    }
  }
</style>