import {
  RES_STATUS_SUCCESS
} from '~/utils/configs';
import { mapActions, mapGetters } from 'vuex';

export default {

  data() {
    return {
      visible: false,
      isValidateEmail: false,
      isClickNext: false
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated'])
  },

  methods: {
    ...mapActions('common/common', ['getUserCheckEmailExist']),

    async $_onValidateEmailExisted (email) {
      if (!this.$v) return
      // if(this.$v.$invalid) return
      if (!this.isAuthenticated && this.$v.email.$model && this.$v.email.email) {
        this.isValidateEmail = true
        const result = await this.getUserCheckEmailExist({ email })
        if (result.code === RES_STATUS_SUCCESS) {
          if (result.data.account_status === 1 && result.data.account_type === 1) {
            this.visible = true;
          } else {
            this.isClickNext && this.nextConfirm()
          }
        } else {
          this.$toast.error(result.message);
        }
        this.isValidateEmail = false
        this.isClickNext = false
      }
    }
  }
}
