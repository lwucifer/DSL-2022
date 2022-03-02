<template>
  <aside class="account-aside">
    <div class="account-aside__info">
      <v-avatar
        :src="get(userInfo , 'avatar', '')"
        class="account-aside__info-avatar"
        size="6.4rem"
      />
      <div class="account-aside__info-right">
        <h5 class="account-aside__info-name">
          {{ get(userInfo , 'name', '') }}
        </h5>
        <v-tooltip placement="top">
          <span
            slot="activator"
            class="account-aside__info-email"
            >{{ get(userInfo , 'email', '') }}</span
          >
          <div style="word-break: break-word;">
            {{ get(userInfo , 'email', '') }}
          </div>
        </v-tooltip>
      </div>
    </div>

    <ul class="account-aside__menu">
      <li class="account-aside__menu-item account-aside__menu-item--profile">
        <n-link :to="`/${defaultLangCode}/account/info`" exact>
          <IconUser class="icon" />
          {{$t("header.acc_info")}}</n-link
        >
      </li>
      <li class="account-aside__menu-item account-aside__menu-item--saved">
        <n-link :to="`/${defaultLangCode}/account/saved-list`">
          <IconList class="icon" />
          {{$t("header.bookmarks")}}</n-link
        >
      </li>
      <li class="account-aside__menu-item account-aside__menu-item--history">
        <n-link :to="`/${defaultLangCode}/account/booking-history`"
          ><IconHistory class="icon" />{{$t("header.history_booking")}}</n-link
        >
      </li>
      <li class="account-aside__menu-item account-aside__menu-item--compare">
        <n-link :to="`/${defaultLangCode}/account/comparison-list`"
          ><IconChart class="icon" />{{$t("header.list_compare")}}</n-link
        >
      </li>
      <li class="account-aside__menu-item account-aside__menu-item--logout">
        <a href="#" @click.prevent="handleLogout"
          ><IconLogout class="icon" />{{$t("header.logout")}}</a
        >
      </li>
    </ul>
  </aside>
</template>

<script>
import IconUser from '~/assets/icons/user.svg?inline';
import IconList from '~/assets/icons/list.svg?inline';
import IconHistory from '~/assets/icons/history.svg?inline';
import IconChart from '~/assets/icons/chart.svg?inline';
import IconLogout from '~/assets/icons/logout.svg?inline';
import Cookies from 'js-cookie';
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
import { get } from 'lodash';
export default {
  components: {
    IconUser,
    IconList,
    IconHistory,
    IconChart,
    IconLogout
  },
  data() {
    return {}
  },
  methods: {
    get,
    ...mapMutations('auth/auth', ['removeToken']),

    handleLogout() {
      this.removeToken();
      localStorage.setItem('history_search', JSON.stringify([]));
      this.$router.push('/');
    }
  },
  computed: {
    ...mapState('auth/auth', ['userInfo']),
    ...mapGetters('common/common', ['defaultLangCode']),
  }
};
</script>
