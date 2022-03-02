<template>
  <div class="common_search-form" :class="fluid ? 'fluid' : 'container'" id="container-common-search-form">
    <div class="box">
      <ul class="common_search-form_top">
        <li class="item count">
          <slot name="search-count">
            <b class="color-primary pr-2">{{count}} </b> {{$t("hotel.result")}}
          </slot>
        </li>
        <li class="item sort">
          <span>{{$t("hotel.sort")}}:</span>
          <SelectWithCheckbox
            v-model="orderBy"
            :placeholder="$t('hotel.choosen')"
            :options="selectSortingCriterias"
            @input="sort()"
            class="transparent"
          />
        </li>
        <li class="item map" v-if="mapFilter">
          <span>{{$t("hotel.map")}}:</span>
          <AppCheckbox
            v-model="map"
            class="ml-4"
            @change="$emit('showmap', map)"
          />
        </li>
      </ul>

      <div
        v-if="show"
        v-sticky="shouldStick"
        :sticky-offset="`{ top: ${stickyOffsetTop} }`"
        class="px-24 py-16 bg-white"
      >
        <div class="common_search-form_content">
          <div class="items">
            <slot name="search-content" />
          </div>
          <v-button
            class="btn-search"
            variant="primary"
            :data-mobile-text="$t('product.search')"
            :loading="false"
            @click="submit"
            ><IconSearch class="icon"
          /></v-button>
        </div>

        <div v-if="isFiltering" class="text-right">
          <a href="" class="danger" @click.prevent="reset">{{$t("hotel.clear_filter")}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SelectWithCheckbox from '~/components/pages/common/SelectWithCheckbox';
import AppCheckbox from '~/components/app/AppCheckbox';
import IconSearch from '~/assets/icons/search.svg?inline';

export default {
  components: {
    SelectWithCheckbox,
    AppCheckbox,
    IconSearch
  },

  watch: {
    propOrderBy(newValue, oldValue) {
      if (newValue === null) {
        this.orderBy = 1;
      }
    }
  },

  props: {
    isFiltering: {
      type: Boolean,
      default: false
    },
    propOrderBy: {
      type: [String, Number, null],
      default: null
    }, 
	count: {
      type: [String, Number, null],
      default: 0
    },
    fluid: {
      type: Boolean,
      default: false
    },
    mapFilter: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      map: false,
      orderBy: 1,
      show: true,
      stickyOffsetTop: 64,
      shouldStick: true
    };
  },

  computed: {
    ...mapGetters('common/selectbox', ['selectAreas']),
    ...mapGetters('common/common', ['selectSortingCriterias']),
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },

  watch: {
    stickyOffsetTop: {
      immediate: true,
      handler(newValue) {
        if (this.shouldStick) {
          this.show = false;
          this.$nextTick(() => {
            this.show = true;
          });
        }
      }
    },

    shouldStick: {
      immediate: true,
      handler(newValue) {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        })
      }
    }
  },

  methods: {
    sort() {
      this.$emit('sort', this.orderBy);
    },

    reset() {
      this.$emit('reset');
    },

    submit() {
      this.$emit('submit');
    },

    handleWindowResize() {
      if (window.innerWidth >= 1440) {
        this.stickyOffsetTop = 80;
        this.shouldStick = true;
      } else if (window.innerWidth >= 1248) {
        this.stickyOffsetTop = 64;
        this.shouldStick = true;
      } else {
        this.shouldStick = false;
      }
    }
  }
};
</script>

<style lang="scss">
@import '~assets/scss/components/pages/common/_search-form.scss';
</style>
