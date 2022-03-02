<script>
import { mapGetters } from 'vuex';
export default {
  middleware({ redirect, app }) {
    redirect(`/${app.i18n.locale}/account/booking-history/hotel`);
  },

  computed: {
    ...mapGetters('common/common', ['defaultLangCode'])
  }
};
</script>
