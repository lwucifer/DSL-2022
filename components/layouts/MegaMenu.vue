<template>
  <ul class="header-menu">
    <li
      v-for="(menu, index) in menuConfig"
      :key="index"
      :class="{
        'has-submenu':
          menu.page_link && menu.sub_menu_list && menu.sub_menu_list.length > 0
      }"
    >
      <a
        v-if="menu.page_type == 3"
        target="_blank"
        :href="`${menu.page_link}`"
        >{{ menu.page_name }}</a
      >
      <n-link
        :class="nuxtActive(menu.page_link) && 'nuxt-link-active'"
        v-else-if="menu.page_type != 3 && menu.page_type != 1"
        :to="`/${defaultLangCode}${menu.page_link}`"
        >{{ menu.page_name }}</n-link
      >

      <ul
        class="submenu"
        v-if="menu.sub_menu_list && menu.sub_menu_list.length > 0"
      >
        <li
          class="submenu-item"
          v-for="(smenu, sindex) in menu.sub_menu_list"
          :key="sindex"
        >
          <a
            v-if="smenu.page_type == 3"
            target="_blank"
            :href="`${smenu.page_link}`"
            >{{ smenu.page_name }}</a
          >

          <n-link v-else :to="`/${defaultLangCode}${smenu.page_link}`">
            {{ smenu.page_name }}
          </n-link>

          <ul
            class="childmenu"
            v-if="smenu.sub_menu_list && smenu.sub_menu_list.length > 0"
          >
            <li
              class="childmenu-item"
              v-for="(s2menu, s2index) in smenu.sub_menu_list"
              :key="s2index"
            >
              <!-- <a href="">Chilmenu</a> -->
              <a
                v-if="s2menu.page_type == 3"
                target="_blank"
                :href="`${s2menu.page_link}`"
                >{{ s2menu.page_name }}</a
              >

              <n-link v-else :to="`/${defaultLangCode}${s2menu.page_link}`">
                {{ s2menu.page_name }}
              </n-link>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  methods: {
    nuxtActive(value) {
      return this.$route.fullPath.includes(value.split('/')[1]);
    }
  },
  computed: {
    ...mapState('common/common', ['menuConfig']),
    ...mapGetters('common/common', ['defaultLangCode'])
  }
};
</script>
<style lang="scss" scoped>
@import '~/assets/scss/components/layouts/_mega-menu.scss';
</style>
