<template>
  <div class="local-around">
      <div class="local-around__title">{{$t("hotel.local_around")}}</div>

      <ul class="local-around__tab" v-if="data.length > 0 && showTab">
          <li v-for="(item, index) in data" :key="index"
            @click="clickTab(item.group_id)" :class="{'active': activeTab == item.group_id}">
            {{item.group_name}}
        </li>
      </ul>

      <div class="restaurant">
          <div class="mapouter w-100">
            <div class="gmap_canvas w-100">
              <LeafletMaps :center="center" :type="activeTab" width="1200" height="400"/>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
//import GoogleMaps from "~/components/pages/common/GoogleMapsAround"
import LeafletMaps from "~/components/pages/common/LeafletMaps"

export default {
    components: {
        LeafletMaps
    },

    props: {
        data: {
            type: Array,
            default: () => [],        
        },
        center: {
            type: [Object, Array],
            default: () => {},
        },
        type: {
            type: [String, Number],
            default: 2,
        },
        showTab: {
            type: [Boolean, Number, String],
            default: false,
        },
    },
    data() {
        return {
            activeTab: this.type,
            map: false
        }
    },
    methods: {
        clickTab(e){
            this.activeTab = e;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_local-around.scss';
</style>