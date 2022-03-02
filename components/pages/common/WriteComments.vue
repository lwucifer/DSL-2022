<template>
  <div class="write-comment mb-4">
    <div class="mt-0 text-right write-comment__box">
      <v-input
        v-if="showInputUserNameComment"
        v-model="userName"
        :placeholder="$t('hotel.full_name_email')"
        size="md"
      />

      <div class="write-comment__box-item">
        <div class="write-comment__box-grid">
          <v-textarea
            ref="textarea"
            class="write-comment__box--text-area"
            v-model="writingComment"
            size="md"
            :placeholder="$t('hotel.share_review_location')"
            :rows="rows"
            @keyup="onChangeTextComment($event)"
            @mouseup="onChangeTextComment($event)"
          />

          <v-upload
            accept="image/*, image/heic, image/heif"
            multiple
            :fileList="fileList"
            @change="handleUploadChange"
          >
            <v-button><IconCamera class="icon mr-3" /></v-button>
          </v-upload>

          <div>
            <v-button
              @click.stop="onPostComment"
              :variant="disabledBtnPost ? 'dark' : 'primary'"
              :disabled="disabledBtnPost"
              @keyup.enter="onPostComment"
              
            >Post</v-button>
          </div>
        </div>
       
        <OverviewImgPostComment
          :images="totalFile"
          @delete="onDeleteImage"
        >
        </OverviewImgPostComment>
      </div>
    </div>  
  </div>
</template>

<script>
import OverviewImgPostComment from '~/components/pages/common/OverviewImgPostComment';
import Progess from '~/components/pages/common/Progess';

import IconCamera from '~/assets/icons/camera.svg?inline';
import { getBase64 } from '~/utils/common';
import { PRODUCT_TYPE } from '~/utils/constants';

import { mapGetters, mapActions } from 'vuex'
import * as configs from '~/utils/configs';

import { get, filter, split, map } from 'lodash'

export default {
  components: {
    IconCamera,
    OverviewImgPostComment,
    Progess
  },

  model: {
    prop: 'comment',
    event: 'input'
  },

  props: {
    comment: {
      type: String,
      default: ''
    },
    comment_id: {
      type: [Number, String],
      default: null
    },
    rating: {
      type: Number,
      default: () => 1
    }
  },

  data () {
    return {
      fileList: [],
      images: [],
      totalFile: [],
      writingComment: '',
      userName: '',
      rows: 1,
      timerCallUpload: null,
      uploading: false
    }
  },

  computed: {
    ...mapGetters('auth/auth', ['userInfo', 'isAuthenticated']),

    disabledBtnPost () {
      const validUserName = this.showInputUserNameComment
      ? this.userName === ''
      : false
      return ( this.writingComment === '' && this.images.length === 0 ) || this.rating === 0 || validUserName || this.uploading
    },

    showInputUserNameComment () {
      return !get(this.userInfo, 'name', get(this.userInfo, 'email', null))
    }
  },

  watch: {
    writingComment (newVal) {
      this.$emit('input', newVal)
    },

    comment (newVal) {
      this.onChangeTextComment()
      this.writingComment = newVal
    }
  },

  created () {
    this.writingComment = this.comment
  },

  methods: {
    ...mapActions('common/common', [
      'uploadFile'
    ]),
    get,

    onChangeTextComment () {
      if (!this.$refs.textarea.$el.firstChild) return
      const textarea = this.$refs.textarea.$el.firstChild
      setTimeout(function(){
        textarea.style.cssText = 'height:auto; padding:0';
        textarea.style.overflow = 'hidden';
        // for box-sizing other than "content-box" use:
        // textarea.style.cssText = '-moz-box-sizing:content-box';
        if (textarea.scrollHeight === 0) return
        textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
      },0);
    },

    async onPostComment () {
      if (this.disabledBtnPost) return
      const customer_name = !this.showInputUserNameComment
      ? get(this.userInfo, 'name', get(this.userInfo, 'email', ''))
      : this.userName
      const contact_info = !this.showInputUserNameComment
      ? get(this.userInfo, 'email', '')
      : this.userName
      const payload = {
        reply_id: this.comment_id,
        product_id: parseInt(get(this.$route.params, 'id', null)),
        customer_name,
        contact_info,
        content: this.writingComment,
        images: this.images
      }
      // validate all feild 
      this.$emit('onPostComments', payload)
      this.images = []
      this.fileList = []
      this.totalFile = []
      this.userName = ''
    },

    async handleUploadChange (fileList, event) {
      this.uploading = true
      clearTimeout(this.timerCallUpload)
      const fileListArr = Array.from(fileList)

      let formData = new FormData()

      for (var i = 0; i < fileListArr.length; i++) {
        formData.append('file', fileListArr[i])
        const fileLoading = {
          url: 'loading',
          type: get(fileListArr[i], 'type', 'image/jpeg'),
          loading: true
        }
        this.totalFile = [fileLoading, ...this.totalFile].slice(0, 5)
      }
      console.log('totalFile', this.totalFile, formData)
      const payload = {
        folder_dir: 'images/hotel',
        formData
      }

      let timerUploadFile = 1
      setInterval(() => {
        timerUploadFile = timerUploadFile + 1
      }, 1000);

      const result = await this.uploadFile(payload)

      if (result.code == configs.RES_STATUS_SUCCESS) {
        const urls = split(get(result.data, 'image_url', ''), ';')

        
        // images show client
        const urlsTrans = map(urls, (url, key) => {
          return {
            url,
            type: get(fileListArr[key], 'type', 'image/jpeg'),
            loading: false
          }
        })
        // ensure keep min timer animation loading = 4s
        if (timerUploadFile > 4) {
          this.totalFile = filter([...urlsTrans, ...this.totalFile], ['loading', false]).slice(0, 5)
          this.images = [...urls, ...this.images].slice(0, 5)
          this.uploading = false
        } else {
          this.timerCallUpload = setTimeout(() => {
            this.totalFile = filter([...urlsTrans, ...this.totalFile], ['loading', false]).slice(0, 5)
            this.images = [...urls, ...this.images].slice(0, 5)
            this.uploading = false
          }, (4 - timerUploadFile) * 1000);
        }
      } else {
        this.totalFile = map(this.images, (url, key) => {
          return {
            url,
            type: 'image/jpeg',
            loading: false
          }
        })
        this.uploading = false
        this.$toast.error(result.message);
      }
    },

    onDeleteImage (_image) {
      this.images = filter(this.images, (img) => img !== _image.url)
      this.totalFile = filter(this.totalFile, (img) => img.url !== _image.url)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_write-comments.scss';
</style>