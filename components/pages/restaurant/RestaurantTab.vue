<template>
  <div
    v-if="show"
    v-sticky
    :sticky-offset="`{ top: ${this.stickyOffsetTop} }`"
    class="restaurant-tab"
    :class="classes"
  >
    <span
      v-for="(item, index) in getTabs"
      :key="index"
      :data-tab-id="item.id"
      @click="tabClick(item, index)"
      :class="{ active: tabActive == item.position }"
      >{{ item.tab }}</span
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { get } from 'lodash';

export default {
  props: {
    classes: String
  },

  data() {
    return {
      tabActive: 1,
      elementActive: 'overview',
      show: true,
      stickyOffsetTop: 48,
    };
  },

  computed: {
    ...mapGetters('restaurant/restaurant', ['restaurantDetail']),

    getTabs() {
      let tabs = [
        {
          id: 'overview',
          tab: this.$t('hotel.overview'),
          position: 1
        },
        {
          id: 'menu',
          tab: this.$t('restaurant.menu'),
          position: 2
        }
      ];
      let position = 3;
      if (get(this, 'restaurantDetail.enable_map', false)) {
        tabs.push({
          id: 'local-around',
          tab: this.$t('hotel.local_around'),
          position: position
        });
        position++;
      }
      if (get(this, 'restaurantDetail.enable_rating', false)) {
        tabs.push({
          id: 'feedback',
          tab: this.$t('hotel.evaluation_2'),
          position: position
        });
        position++;
      }
      if (get(this, 'restaurantDetail.enable_suggestion', false)) {
        tabs.push({
          id: 'is-care',
          tab: this.$t('hotel.maybe_interested'),
          position: position
        });
        position++;
      }

      return tabs;
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },
  
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleWindowResize);
  },

  watch: {
    stickyOffsetTop: {
      immediate: true,
      handler(newValue) {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        })
      }
    },

    elementActive(newValue) {
      const wrapper = this.$el;
      const linkEl = wrapper.querySelector(`[data-tab-id="${this.elementActive}"]`);
      if (linkEl && wrapper.scrollWidth > wrapper.clientWidth) {
        wrapper.scrollLeft = linkEl.offsetLeft;
      }
    }
  },

  methods: {
    get,

    tabClick(e, index) {
      const height = document.getElementsByClassName('restaurant-tab')[0]
        .offsetHeight;
      const element = document.getElementsByClassName(e.id)[0];
      window.scrollTo(0, element.offsetTop - height - 80);
      setTimeout(() => {
        this.tabActive = e.position;
        this.elementActive = e.id;
      }, 690);
    },

    handleScroll() {
      if (!document.getElementsByClassName('restaurant-tab')[0]) return;
      if (!document.getElementsByClassName(this.elementActive)[0]) return;

      const height = document.getElementsByClassName('restaurant-tab')[0]
        .offsetHeight;
      const element = document.getElementsByClassName(this.elementActive)[0];
      let top = element.offsetTop - height - 80;
      let bottom = element.offsetTop + element.offsetHeight - height - 104;
      let current = window.scrollY;
      if (top > Math.ceil(current) && this.tabActive > 1) {
        this.tabActive = this.tabActive - 1;
      }
      if (bottom < Math.ceil(current) && this.tabActive < this.getTabs.length) {
        this.tabActive = this.tabActive + 1;
      }
      this.elementActive = this.getTabs[this.tabActive - 1]['id'];
    },

    handleWindowResize() {
      if (window.innerWidth >= 1440) {
        this.stickyOffsetTop = 80;
      } else if (window.innerWidth >= 1248) {
        this.stickyOffsetTop = 64;
      } else {
        this.stickyOffsetTop = 48;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/components/pages/restaurant/_restaurant-tab.scss';
</style>
