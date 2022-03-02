<template>
  <span class="header-account">
    <v-dropdown
      content-class="header-account__dropdown-content"
      placement="bottom-end"
      trigger="hover"
      :panel-width="170"
    >
      <n-link slot="activator" to="" class="header-account__activator">
        <span class="header-account__name">{{
          get(userInfo, 'name', get(userInfo, 'email', ''))
        }}</span>
        
        <IconUser2 class="icon d-xl-none" />
        <v-avatar
          class="header-account__avatar d-none d-xl-inline-flex"
          :size="32"
          :src="get(userInfo, 'avatar', '')"
        />
      </n-link>

      <ul class="header-account__menu">
        <li>
          <n-link
            class="header-account__menu-user"
            :to="`/${defaultLangCode}/account/info`"
            exact
            ><IconUser class="icon" />{{$t("header.acc_info")}}</n-link
          >
        </li>
        <li>
          <n-link
            class="header-account__menu-saved"
            :to="`/${defaultLangCode}/account/saved-list`"
            ><IconList class="icon" />{{$t("header.bookmarks")}}</n-link
          >
        </li>
        <li>
          <n-link
            class="header-account__menu-history"
            :to="`/${defaultLangCode}/account/booking-history`"
          >
            <IconHistory class="icon" />{{$t("header.history_booking")}}</n-link
          >
        </li>
        <li>
          <n-link
            class="header-account__menu-compare"
            :to="`/${defaultLangCode}/account/comparison-list`"
            ><IconChart class="icon" />{{$t("header.list_compare")}}</n-link
          >
        </li>
        <li>
          <a
            class="header-account__menu-logout"
            href=""
            @click.prevent="confirmLogout = true"
          >
            <IconLogout class="icon" />{{$t("header.logout")}}</a
          >
        </li>
      </ul>
    </v-dropdown>

    <v-modal
      v-model="confirmLogout"
      :header="false"
      :width="600"
      size="lg"
      centered
      @cancel="confirmLogout = false"
      @ok="handleLogout"
    >
      <div class="text-center">
        <h3 class="mb-16 danger">{{$t("header.logout")}}</h3>
        <p>{{$t("header.sure_logout")}}</p>
      </div>
    </v-modal>
  </span>
</template>

<script>
import IconUser from '~/assets/icons/user.svg?inline';
import IconList from '~/assets/icons/list.svg?inline';
import IconHistory from '~/assets/icons/history.svg?inline';
import IconChart from '~/assets/icons/chart.svg?inline';
import IconLogout from '~/assets/icons/logout.svg?inline';
import IconUser2 from '~/assets/icons/user-2.svg?inline';
import Cookies from 'js-cookie';
import { mapMutations, mapState, mapGetters } from 'vuex';
import { get } from 'lodash';

export default {
  components: {
    IconUser,
    IconUser2,
    IconList,
    IconHistory,
    IconChart,
    IconLogout
  },
  data() {
    return {
      confirmLogout: false
    };
  },
  computed: {
    ...mapState('auth/auth', ['userInfo']),
    ...mapGetters('common/common', ['defaultLangCode'])
  },
  methods: {
    ...mapMutations('auth/auth', ['removeToken']),
    get,
    handleLogout() {
      this.removeToken();
      localStorage.setItem('history_search', JSON.stringify([]));
      this.confirmLogout = false;
      this.$router.push(`/${this.defaultLangCode}`);
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/layouts/_header-default-account.scss';
</style>
