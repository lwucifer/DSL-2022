<template>
  <h3>Redirecting, please wait...</h3>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { RES_STATUS_SUCCESS } from '~/utils/configs';

export default {
  data() {
    return {
      prevRoute: null
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from.path;
    });
  },

  computed: {
    ...mapGetters('common/common', ['defaultLangCode'])
  },

  methods: {
    ...mapActions('auth/auth', ['postUserSsoFacebook']),
    ...mapMutations('common/eventBus', ['setModalAuth'])
  },

  async mounted() {
    const { code, error } = this.$route.query;
    if (!code || error) {
      this.$router.push(`/${this.defaultLangCode}/?errorLogin=true`);
      return;
    }

    const result = await this.postUserSsoFacebook({ code });
    if (result.code == RES_STATUS_SUCCESS) {
      this.$toasted.success(this.$t('social.login_fb_success'));
      this.$router.push(`/${this.defaultLangCode}`);
    } else {
      this.$router.push(`/${this.defaultLangCode}/?errorLogin=true`);
    }
  }
};
</script>

<style></style>
