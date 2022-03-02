<template>
  <div class="menu-mobile" :class="{ show: isShowMenuMobile }">
    <div class="menu-mobile__backdrop" @click="setMenuMobileShow(false)"></div>

    <nav class="menu-mobile__content">
      <!--prettyhtml-ignore-->
      <!-- prettier-ignore -->
      <div class="menu-mobile__topbar">
        <span>
          <IconRain class="icon primary" />&nbsp;<!-- 
          -->{{ get(weather, 'name', '...') }}&nbsp;<!-- 
          --><span class="primary"><!-- 
            -->{{ get(weather, 'main.temp', '--') }}<sup>o</sup>C<!-- 
          --></span>
        </span><!-- 

        --><span
          >{{ $t('header.air_quality') }}:<!-- 
          -->&nbsp;<span class="primary"
            >AQI {{ getAqi }} &nbsp;{{ $t(aqiFilter(getAqi)) }}</span
          ></span
        >
        <a href="" class="menu-mobile__close" @click.prevent="setMenuMobileShow(false)">
          <IconClose class="icon d-block" />
        </a>
      </div>

      <ul class="menu-mobile__menu-list">
        <li class="menu-mobile__menu-item">
          <n-link :to="localePath('/')"
            ><IconHome class="icon" />{{ $t('header.home_page') }}</n-link
          >
        </li>

        <li
          v-for="(menu, index) in menuConfig"
          :key="index"
          class="menu-mobile__menu-item"
          :class="{
            'menu-mobile__menu-item--has-submenu':
              menu.page_link &&
              menu.sub_menu_list &&
              menu.sub_menu_list.length > 0,
            'active': menuItemActive.includes(menu.id)
          }"
        >
          <a
            v-if="menu.page_type == 3"
            target="_blank"
            :href="`${menu.page_link}`"
            >{{ menu.page_name }}</a
          >
          <n-link
            :class="nuxtActive(menu.page_link) && 'active'"
            v-else-if="menu.page_type != 3 && menu.page_type != 1"
            :to="`/${defaultLangCode}${menu.page_link}`"
          >
            <IconHotel2
              v-if="menu.page_type === MENU_PAGE_TYPE.HOTEL"
              class="icon"
            />
            <IconChef2
              v-if="menu.page_type === MENU_PAGE_TYPE.RESTAURANT"
              class="icon"
            />
            <IconFlight3
              v-if="menu.page_type === MENU_PAGE_TYPE.TOUR"
              class="icon"
            />
            <IconSchedule2
              v-if="menu.page_type === MENU_PAGE_TYPE.PRODUCT"
              class="icon"
            />
            <IconNewspaper
              v-if="menu.page_type === MENU_PAGE_TYPE.NEWS"
              class="icon"
            />

            <IconDiscount
              v-if="menu.page_type === MENU_PAGE_TYPE.SALE"
              class="icon"
            />
            {{ menu.page_name }}
          </n-link>

          <span
            v-if="menu.sub_menu_list && menu.sub_menu_list.length > 0"
            class="menu-mobile__menu-item-arrow"
            @click="toggleSubMenu(menu)"
          >
            <IconArrowForward class="icon" />
          </span>

          <transition
            enter-active-class="animated faster fadeInDown"
            leave-active-class="animated faster fadeOutUp"
          >
            <ul
              class="menu-mobile__submenu"
              v-if="menu.sub_menu_list && menu.sub_menu_list.length > 0"
              v-show="menuItemActive.includes(menu.id)"
            >
              <li
                v-for="(smenu, sindex) in menu.sub_menu_list"
                :key="sindex"
                class="menu-mobile__submenu-item"
                :class="{
                  'menu-mobile__submenu-item--has-submenu':
                    smenu.page_link &&
                    smenu.sub_menu_list &&
                    smenu.sub_menu_list.length > 0,
                  'active': menuItemActive.includes(smenu.id)
                }"
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

                <span
                  v-if="smenu.sub_menu_list && smenu.sub_menu_list.length > 0"
                  class="menu-mobile__menu-item-arrow"
                  @click="toggleSubMenu(smenu)"
                >
                  <IconArrowForward class="icon" />
                </span>

                <transition
                  enter-active-class="animated faster fadeInDown"
                  leave-active-class="animated faster fadeOutUp"
                >
                  <ul
                    class="menu-mobile__submenu"
                    v-if="smenu.sub_menu_list && smenu.sub_menu_list.length > 0"
                    v-show="menuItemActive.includes(smenu.id)"
                  >
                    <li
                      class="menu-mobile__submenu-item"
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

                      <n-link
                        v-else
                        :to="`/${defaultLangCode}${s2menu.page_link}`"
                      >
                        {{ s2menu.page_name }}
                      </n-link>
                    </li>
                  </ul>
                </transition>
              </li>
            </ul>
          </transition>
        </li>

        <li
          class="menu-mobile__menu-item menu-mobile__menu-item--select"
          :class="{ active: menuSelectActive.includes(1) }"
        >
          <a
            class="d-flex justify-content-between"
            href=""
            @click.prevent="() => setMenuSelectActive(1)"
          >
            <span><IconGlobe class="icon" />{{ $t('header.language') }}</span>
            <span class="menu-mobile__select">
              <span class="menu-mobile__select-label">{{
                defaultLang.name
              }}</span>
              <IconArrowForward class="icon" />
            </span>
          </a>

          <transition
            enter-active-class="animated faster fadeInDown"
            leave-active-class="animated faster fadeOutUp"
          >
            <ul v-show="menuSelectActive.includes(1)" class="menu-mobile__submenu">
              <li
                v-for="item in selectLanguages"
                :key="item.value"
                class="menu-mobile__submenu-item"
              >
                <a
                  href=""
                  :class="{ primary: item.value === defaultCurrency.id }"
                  @click.prevent="setLanguage(item.value)"
                  >{{ item.text }}</a
                >
              </li>
            </ul>
          </transition>
        </li>

        <li
          class="menu-mobile__menu-item menu-mobile__menu-item--select"
          :class="{ active: menuSelectActive.includes(0) }"
        >
          <a
            class="d-flex justify-content-between"
            href=""
            @click.prevent="() => setMenuSelectActive(0)"
          >
            <span
              ><IconDollarCircle class="icon" />{{
                $t('header.currency')
              }}</span
            >
            <span class="menu-mobile__select">
              <span class="menu-mobile__select-label">{{
                defaultCurrency.code
              }}</span>
              <IconArrowForward class="icon" />
            </span>
          </a>

          <transition
            enter-active-class="animated faster fadeInDown"
            leave-active-class="animated faster fadeOutUp"
          >
            <ul
              v-show="menuSelectActive.includes(0)"
              class="menu-mobile__submenu"
            >
              <li
                v-for="item in selectCurrencies"
                :key="item.value"
                class="menu-mobile__submenu-item"
              >
                <a
                  href=""
                  :class="{ primary: item.value === defaultCurrency.id }"
                  @click.prevent="
                    setCurrency(item.value)
                  "
                  >{{ item.text }}</a
                >
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { get } from 'lodash';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { MENU_PAGE_TYPE } from '~/utils/constants';
import IconRain from '~/assets/icons/rain.svg?inline';
import IconClose from '~/assets/icons/close.svg?inline';
import IconHome from '~/assets/icons/home.svg?inline';
import IconHotel2 from '~/assets/icons/hotel-2.svg?inline';
import IconChef2 from '~/assets/icons/chef-2.svg?inline';
import IconFlight3 from '~/assets/icons/flight-3.svg?inline';
import IconSchedule2 from '~/assets/icons/schedule-2.svg?inline';
import IconGlobe from '~/assets/icons/globe.svg?inline';
import IconDollarCircle from '~/assets/icons/dollar-circle.svg?inline';
import IconArrowForward from '~/assets/icons/arrow_forward.svg?inline';
import IconNewspaper from '~/assets/icons/newspaper_icon.svg?inline';
import IconDiscount from '~/assets/icons/discount.svg?inline';
import { aqiFilter } from '~/plugins/filters'

export default {
  components: {
    IconRain,
    IconClose,
    IconHome,
    IconHotel2,
    IconChef2,
    IconFlight3,
    IconSchedule2,
    IconGlobe,
    IconDollarCircle,
    IconArrowForward,
    IconNewspaper,
    IconDiscount
  },

  data() {
    return {
      menuItemActive: [],
      menuSelectActive: []
    };
  },

  computed: {
    ...mapState('common/common', [
      'menuConfig',
      'weather',
      'defaultCurrency',
      'defaultLang'
    ]),
    ...mapState('common/eventBus', ['isShowMenuMobile']),
    ...mapGetters('common/common', [
      'defaultLangCode',
      'getAqi',
      'selectCurrencies',
      'selectLanguages'
    ])
  },

  created() {
    this.MENU_PAGE_TYPE = Object.freeze(MENU_PAGE_TYPE);
  },

  watch: {
    $route: function () {
      this.setMenuMobileShow(false);
    }
  },

  methods: {
    get,
    aqiFilter,
    
    ...mapMutations('common/eventBus', ['setMenuMobileShow']),
    ...mapMutations('common/common', [
      'setUtilitiesDefaultConfigLang',
      'setUtilitiesDefaultConfigCurrency'
    ]),

    nuxtActive(value) {
      return this.$route.fullPath.includes(value.split('/')[1]);
    },

    setMenuSelectActive(id) {
      this.menuSelectActive.includes(id)
        ? (this.menuSelectActive = this.menuSelectActive.filter(
            (item) => item !== id
          ))
        : (this.menuSelectActive = [...this.menuSelectActive, id]);
    },

    toggleSubMenu({ id }) {
      console.log('toggleSubMenu', id);
      this.menuItemActive.includes(id)
        ? (this.menuItemActive = this.menuItemActive.filter(
            (item) => item !== id
          ))
        : (this.menuItemActive = [...this.menuItemActive, id]);
    },

    setCurrency(_value) {
      this.setUtilitiesDefaultConfigCurrency(_value);
      this.menuSelectActive = []
    },

    setLanguage(_value) {
      this.setUtilitiesDefaultConfigLang(_value);
      this.menuSelectActive = []
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/layouts/_menu-mobile.scss';
</style>
