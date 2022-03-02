<template>
  <div class="google-maps animated fadeIn" :class="classes">
    <div class="geolocation" v-on:click="geolocation()">
      <div v-if="showDirect" class="google-maps_direction">
        <v-button title="Quay lại" @click="showDirect = false" class="google-map_close">
          <span></span>
        </v-button>
        <GoogleMap :map="current" :width="width" :height="height" open/>
      </div>
      <gmap-map
        :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUi: false
        }"
        v-else
        :center="{ lat: get(current, 'lat', 0), lng: get(current, 'lon', 0) }"
        :zoom="13"
        :style="'width:'+ width +'px;  height: ' + height +'px'"
        ref="googleMaps"
        draggable
        @center_changed="e => ondrag(e)"
      >
        <gmap-info-window :options="infoOptions" :position="infoPosition" :opened="infoOpened" @closeclick="infoOpened=false">
          <div class="map-info animated fadeIn">
            <div class="map-info_image">
              <div class="map-info_actions">
                <a
                  class="map-info_share"
                  title="Chia sẻ"
                  @click.prevent="openShareThis = true"
                >
                  <IconShare class="icon" />
                </a>
                <a
                  title="Chỉ đường"
                  class="map-info_direct"
                  @click.prevent="showDirect = true"
                >
                  <IconPlan class="icon"/>
                </a>
                <a
                  class="map-info_favorite"
                  :class="{ active: favorite }"
                  :title="favorite ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'"
                  @click.prevent="handelFavorite(favorite)"
                >
                  <IconHeartFilled class="icon" v-if="favorite"/>
                  <IconHeart class="icon" v-else/>
                </a>
              </div>
              <a class="map-info_content_title" target="_blank" :href="getUrlDetail()">
                <img :src="get(infoContent, 'default_thumbnail', '')" alt/>
              </a>
            </div>
            <div class="map-info_content" @click="toDetail">
              <a class="map-info_content_title" target="_blank" :href="getUrlDetail()">
                {{get(infoContent, 'name', '')}}
              </a>
              <div class="map-info_content_vote">
                <AppStars :stars="get(infoContent, 'vote', 0)"  :size="11"/> 
                ({{get(infoContent, 'number_votes', 0)}})
              </div>
              <div class="map-info_content_address">
                <IconPin/> 
                {{get(infoContent, 'address', '')}}
              </div>
              <strong class="map-info_content_price secondary">
                {{get(infoContent, 'price', 0) | numeralFormat}} Đ
              </strong>
            </div>
          </div>
        </gmap-info-window>
        <gmap-marker
          :key="index"
          v-for="(m, index) in markers"
          :position="{ lat: m.lat, lng: m. lon }"
          :clickable="true"
          :icon="getMarkerOptions(m)"
          :opened="{lat:0, lng:0}"
          :zIndex="getZIndex(m)"
          @mouseover="selectItem(m, index, true)"
          @mouseout="getProductId(m) == getProductId(current) ? infoOpened = true : infoOpened = false"
          @click="selectItem(m, index)"
        >
        </gmap-marker>
      </gmap-map>
    </div>

     <ul class="related-address animated fadeIn">
          <li @click="selectItem(item, index)" v-for="(item, index) in markers" :key="index">
              <p class="address-name mb-0">{{item.name}}</p>
              <p class="mb-0 secondary">{{getDistance(center, {lat: item.lat, lon: item.lon})}} Km</p>
          </li>
      </ul>

      <ShareThis
        :url="baseUrl + getUrlDetail()"
        :title="get(infoContent, 'name', '')"
        :tag="get(infoContent, 'name', '')"
        :description="get(infoContent, 'name', '')"
        :width="600"
        centered
        v-model="openShareThis"
        @cancel="openShareThis = false"
      />

      <ModalAuth
        v-model="modalSignIn"
        :width="600"
        centered
        @cancel="modalSignIn = false"
      >
        <FormSignIn />
      </ModalAuth>
  </div>
</template>

<script>
import ModalAuth from '~/components/modals/ModalAuth'
import FormSignIn from '~/components/forms/FormSignIn'
import IconPin from '~/assets/icons/pin2.svg?inline'
import IconPlan from '~/assets/icons/plan.svg?inline'
import IconHeart from '~/assets/icons/heart-outline.svg?inline'
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline'
import AppStars from '~/components/app/AppStars'
import GoogleMap from '~/components/pages/common/GoogleMap'
import ShareThis from '~/components/pages/common/ShareThis'
import IconShare from '~/assets/icons/share-outline.svg?inline'
import { PRODUCT_TYPE } from '~/utils/constants'
import { mapActions, mapGetters } from 'vuex'
import {get} from 'lodash'
import { RES_STATUS_SUCCESS } from '~/utils/configs'

const pinBlack = require('~/assets/icons/pin-black.svg')
const pinRed = require('~/assets/icons/pin-red.svg')

export default {
  name: "GoogleMapsAround",
  components: {
    ModalAuth,
    FormSignIn,
    AppStars,
    GoogleMap,
    IconPin,
    IconPlan,
    IconHeart,
    IconHeartFilled,
    ShareThis,
    IconShare
  },

  props: {
    classes: String,
    center: {
      type: [Object, Array],
      required: false
    },
    height: {
      type: [String, Number],
      default: 900,
      required: false
    },
    width: {
      type:[String, Number],
      default: 450,
      required: false
    },
    type: {
      type:[String, Number],
      required: false
    }
  },

  data() {
    return {
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      markers: [],
      openShareThis: false,
      loading: false,
      loadingFavorite: false,
      showDirect: false,
      current: this.center,
      favorite: get(this.center, 'is_favorite', false),
      newCurrent: null,
      newCurrentLoading: false,
      searchAddressInput: '',
      markerBlack: {
        url: pinBlack,
        scaledSize: {width: 35, height: 51, f: 'px', b: 'px',},
      },
      markerRed: {
        url: pinRed,
        scaledSize: {width: 35, height: 51, f: 'px', b: 'px',},
      },
      modalSignIn: false,
      infoPosition: null,
      infoContent: this.center,
      infoOpened: false,
      infoCurrentKey: null,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35  
        }
      }, 
      selected: false,
    };
  },

  computed: {
    ...mapGetters('auth/auth', ['isAuthenticated']),
  },

  watch: {
    type(){
      this.current = this.center;
      this.showDirect = false;
      this.getMap(true);
    },
    'current.lat': {
      deep: false,
      handler() {
        this.getMap();
      }
    },
    'current.lon': {
      deep: false,
      handler() {
        this.getMap();
      }
    },
  },

  // fetch() {
  //   this.getMap();
  // },
  mounted() {
    this.getMap();
  },

  methods: {
    get,
    ...mapActions('aroundLocation/aroundLocation', ['getAroundLocationRestaurant', 'getAroundLocationHotel', 'getAroundLocationProduct']),
    ...mapActions('favorite/favorite', ['postFavorite']),

    async handelFavorite(e) {
      const self = this;
      if (this.isAuthenticated) {
        if (this.loadingFavorite) return;
        this.loadingFavorite = true;

        const params = {
          id: self.current ? self.getProductId(self.current) : self.getProductId(self.center),
          type: self.type,
          isFavorite: e
        };
        const res = await this.postFavorite(params);

        if (res.code === RES_STATUS_SUCCESS) {
          this.$toast.global.primary(
            e
              ? 'Đã xoá khỏi danh sách yêu thích'
              : 'Đã lưu vào danh sách yêu thích'
          );
          this.favorite = !this.favorite;
          this.selected = true;
          this.getMap();
        } else {
          this.$toast.error(res.message);
        }
        this.loadingFavorite = false;
      } else {
        this.modalSignIn = true;
      }
    },

    async getMap(newTab) {
      if (this.loading) return false;

      this.loading = true;
      let lat = get(this.current, 'lat', false) ?  get(this.current, 'lat', 0) : get(this.center, 'lat', 0);
      let lon = get(this.current, 'lon', false) ?  get(this.current, 'lon', 0) : get(this.center, 'lon', 0);
      let params = {lat: lat, lon: lon, distance: 2000};
      let res = [];

      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        res = await this.getAroundLocationRestaurant(params);
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        res = await this.getAroundLocationHotel(params);
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        res = await this.getAroundLocationProduct(params);
      }

      this.markers = get(res, 'data', []);
      this.infoOpened = !newTab && this.selected && this.markers.length > 0;
      this.selected = false;
      this.loading = false;
      this.newCurrentLoading = false;
    },

    toDetail(){
      let route = this.$router.resolve({path: this.getUrlDetail()});
      window.open(route.href, '_blank');
    },
    getUrlDetail(){
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        return '../../restaurant/detail/' + get(this.infoContent,'restaurant_id', '')
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        return '../../hotel/detail/' + get(this.infoContent,'hotel_id', '')
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        return '../../product-travel/detail/' + get(this.infoContent,'id', '')
      }
      return '#'
    },
    
    getZIndex(marker){
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        if (marker.restaurant_id == this.infoContent.restaurant_id) return 9
        if (marker.restaurant_id == this.current.restaurant_id) return 8
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        if (marker.hotel_id == this.infoContent.hotel_id) return 9
        if (marker.hotel_id == this.current.hotel_id) return 8
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        if (marker.hotel_id == this.infoContent.id) return 9
        if (marker.hotel_id == this.current.id) return 8
      }

      return 1
    },
    
    getMarkerOptions(marker){
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        if (
          marker.restaurant_id == this.current.restaurant_id ||
          (marker.restaurant_id == this.infoContent.restaurant_id && this.infoOpened)
        ) return this.markerRed
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        if (
          marker.hotel_id == this.current.hotel_id ||
          (marker.hotel_id == this.infoContent.hotel_id && this.infoOpened)
        ) return this.markerRed
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        if (
          marker.id == this.current.id ||
          (marker.id == this.infoContent.id && this.infoOpened)
        ) return this.markerRed
      }

      return this.markerBlack
    },
    
    getProductId(marker){
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        return marker.restaurant_id
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        return marker.hotel_id
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        return marker.id
      }
    },

    getPosition (marker) {
      return {
        lat: parseFloat(marker.lat),
        lng: parseFloat(marker.lon)
      }
    },
    
    selectItem (marker, key, hover) {
      this.selected = !hover;
      if(!hover) {
        this.current = marker;
      }
      this.favorite = marker.is_favorite;

      if (this.getProductId(marker) == this.getProductId(this.current)) {
        this.newCurrentLoading = false;
      } else {
        this.infoOpened = false;
      }
      
      if (this.getProductId(marker)) {
        setTimeout(() => {
        this.infoPosition = this.getPosition(marker);
        this.infoContent = marker;
        this.infoOpened = true;
        this.infoCurrentKey = key;
        }, 0);
      }
    },

    ondrag (e) {
      this.newCurrent = {lat: e.lat(), lon: e.lng()};
      this.newCurrentLoading = true;
      this.infoOpened = false;
    },
    geolocation () {
      if(this.newCurrentLoading) {
        this.current = this.newCurrent;
        this.getMap();
      }
    },

    rad (x) {
      return x * Math.PI / 180;
    },
    roundToTwo(num) {    
      return +(Math.round(num + "e+2")  + "e-2");
    },
    getDistance (p1, p2) {
      const R = 6378.137;
      const dLat = this.rad(p2.lat - p1.lat);
      const dLong = this.rad(p2.lon - p1.lon);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      return this.roundToTwo(d);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_google-maps.scss';
</style>