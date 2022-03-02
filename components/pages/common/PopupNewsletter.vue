<template>
    <v-modal
      v-model="confirmPopup"
      :header="false"
      :width="1200"
      size="lg"
      centered
      @cancel="closeNewsletter"
      :footer="false"
      bodyClass="newletter-body px-0 py-0"
    >
      <div class="text-center">
        <img src="~assets/images/newletter-img.png" alt="">
        <h3 class="mt-5 deep-dark">{{$t("home.register_now")}}</h3>
        <p class="heading-5 mb-24">{{$t("home.receive_promotion")}}</p>

        <div class="newletter-submit">
          <v-input :placeholder="$t('header.input_email')" 
            append-class="px-0 py-0"
            class="newletter-submit-input"
            v-model="email"
          >
            <template #append>
              <v-button variant="primary" @click="registerNewsletter">{{$t("header.register")}}</v-button>
            </template>
          </v-input>

          <span class="danger caption" >
            {{errorMail}}
          </span>
        </div>
      </div>
    </v-modal>
</template>

<script>
import { TIME_SHOW_POPUP, NEWSLETTER } from '~/utils/constants'
import Cookies from 'js-cookie';
import { mapActions,  mapGetters} from 'vuex';
import { validateEmail } from '~/utils/validations';

export default {
    data() {
        return {
          confirmPopup: false,
          email: "",
          errorMail: ""
        }
    },

    computed: {
      ...mapGetters('auth/auth', ['isAuthenticated'])
    },

    methods: {
      ...mapActions('common/user', ['getNewsletter', 'getCheckNewsletter']),

      async checkShowPopup() {
        if(this.isAuthenticated) {
          const emailUser = JSON.parse(localStorage.getItem("token_user")).email;
          const isRegisterNewsletter = await this.getCheckNewsletter({email: emailUser});

          if(isRegisterNewsletter.code == NEWSLETTER.NOT_REGISTER) {
            setTimeout(() => { 
              this.confirmPopup = true;
            }, TIME_SHOW_POPUP);
          }else {
            this.confirmPopup = false;
          }
        }else {
          setTimeout(() => { 
            this.confirmPopup = true;
          }, TIME_SHOW_POPUP);
        }
      },   
      
      closeNewsletter() {
        this.confirmPopup = false;
        Cookies.set('isCloseNewsletter', true);
      },

      async registerNewsletter() {
        if(validateEmail(this.email)){
          const isRegisterNewsletter = await this.getCheckNewsletter({email: this.email});
          if(isRegisterNewsletter.code == NEWSLETTER.REGISTED){
            this.errorMail = this.$t("header.duplicate_email")
          }else {
            this.errorMail = "";
            this.getNewsletter({email: this.email});
            this.$toasted.success(this.$t('home.register_noti_success'));
            this.confirmPopup = false;
          }
        }else {
          this.errorMail = this.$t('header.invalid_email');
        }
        
      }
    },

    mounted() {
      this.checkShowPopup()
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/components/pages/common/_popup-newsletter.scss"
</style>