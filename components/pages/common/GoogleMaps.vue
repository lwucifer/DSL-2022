<template>
  <div class="leaflet-maps" :class="classes">
    <ul class="leaflet-maps__tab" v-if="getAroundLocations.length > 0">
      <li
        v-for="(item, index) in getAroundLocations"
        :key="index"
        @click="clickTab(item.id)"
        :class="{ active: activeTab == item.id }"
      >
        {{ item.name }}
      </li>
    </ul>
    <div
      class="geolocation"
      :class="loading ? 'loading' : ''"
      :style="`height: ${height}px`"
    >
      <v-button
        title="Quay lại"
        @click="showDirect = false"
        class="leaflet-map_close"
        v-if="showDirect"
      >
        <span></span>
      </v-button>
      <div class="leaflet-maps_search" v-if="!showDirect">
        <IconPin class="icon icon-pin" />
        <MapSearch @input="(e) => search(e)" :placeholder="$t('map.search_by_location')"/>
      </div>
      <client-only>
        <l-map
          :zoom="15"
          :center="[get(current, 'lat', 0), get(current, 'lon', 0)]"
          ref="myMap"
          id="map"
		      @zoom="handleZoom"
          @dragend="handleDragEnd"
          @ready="doSomethingOnReady"
          v-if="!showDirect"
        >
          <l-tile-layer
            url="https://osrm.hcdt.vn:9000/osm/{z}/{x}/{y}.png"
          ></l-tile-layer>
          <l-marker
            @l-add="$event.target.openPopup()"
            @click="(e) => selectItem(m, index, e)"
            @mouseover="(e) => handelHover(m, index, e)"
            @mouseout="active = {}"
            :lat-lng="[get(m, 'lat', 0), get(m, 'lon', 0)]"
            :key="index"
            v-for="(m, index) in markersData"
          >
            <l-icon
              :icon-size="dynamicSize"
              :icon-anchor="dynamicAnchor"
              :icon-url="src(m)"
              :class-name="classIcon(m)"
            />
            <l-popup v-show="!loading">
              <div class="map-info">
                <div class="map-info_image">
                  <div class="map-info_actions">
                    <a
                      class="map-info_share"
                      title="Chia sẻ"
                      @click.prevent="share(current)"
                    >
                      <IconShare class="icon" />
                    </a>
                    <a
                      title="Chỉ đường"
                      class="map-info_direct"
                      @click.prevent="direct(current)"
                    >
                      <IconPlan class="icon" />
                    </a>
                    <a
                      class="map-info_favorite"
                      :class="{ active: favorite }"
                      :title="
                        favorite
                          ? 'Xóa khỏi danh sách yêu thích'
                          : 'Thêm vào danh sách yêu thích'
                      "
                      @click.prevent="handelFavorite(current, favorite)"
                    >
                      <IconHeartFilled class="icon" v-if="favorite" />
                      <IconHeart class="icon" v-else />
                    </a>
                  </div>
                  <a target="_blank" :href="getUrlDetail(current)">
                    <img
                      :src="
                        get(current, 'default_thumbnail', false)
                          ? get(current, 'default_thumbnail', '')
                          : get(current, 'thumbnail', '')
                      "
                      alt
                    />
                  </a>
                </div>
                <div class="map-info_content" @click="toDetail(current)">
                  <a
                    class="map-info_content_title"
                    target="_blank"
                    :href="getUrlDetail(current)"
                  >
                    {{
                      get(current, 'name', '')
                        ? get(current, 'name', '')
                        : get(current, 'productName', '')
                    }}
                  </a>
                  <div class="map-info_content_vote">
                    <AppStars
                      :stars="getRate(current)"
                      :size="11"
                    />
                    ({{getNumberRate(current)}})
                  </div>
                  <div
                    class="map-info_content_address"
                    v-if="get(current, 'address', false)"
                  >
                    <IconPin />
                    {{ get(current, 'address', '') }}
                  </div>
                  <strong class="map-info_content_price secondary">
                    {{ get(current, type == PRODUCT_TYPE.RESTAURANT ? 'from_price' : 'price', 0) | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }}
                  </strong>
                </div>
              </div>
            </l-popup>
            <!-- tooltip -->
            <l-tooltip v-if="isDeskop" :options="{ direction: 'top', opacity: 1 }">
              <div class="map-info map-tooltip a">
                <div class="map-info_image">
                  <div class="map-info_actions">
                    <a
                      class="map-info_share"
                      title="Chia sẻ"
                      @click.prevent="share(m)"
                    >
                      <IconShare class="icon" />
                    </a>
                    <a
                      title="Chỉ đường"
                      class="map-info_direct"
                      @click.prevent="direct(m)"
                    >
                      <IconPlan class="icon" />
                    </a>
                    <a
                      class="map-info_favorite"
                      :class="{
                        active:
                          type == PRODUCT_TYPE.PRODUCT
                            ? get(m, 'isFavorite', false)
                            : get(m, 'is_favorite', false)
                      }"
                      :title="
                        (
                          type == PRODUCT_TYPE.PRODUCT
                            ? get(m, 'isFavorite', false)
                            : get(m, 'is_favorite', false)
                        )
                          ? 'Xóa khỏi danh sách yêu thích'
                          : 'Thêm vào danh sách yêu thích'
                      "
                      @click.prevent="
                        handelFavorite(
                          m,
                          type == PRODUCT_TYPE.PRODUCT
                            ? get(m, 'isFavorite', false)
                            : get(m, 'is_favorite', false)
                        )
                      "
                    >
                      <IconHeartFilled
                        class="icon"
                        v-if="
                          type == PRODUCT_TYPE.PRODUCT
                            ? get(m, 'isFavorite', false)
                            : get(m, 'is_favorite', false)
                        "
                      />
                      <IconHeart class="icon" v-else />
                    </a>
                  </div>
                  <a target="_blank" :href="getUrlDetail(m)" class="thumbnail">
                    <img
                      :src="
                        get(m, 'default_thumbnail', false)
                          ? get(m, 'default_thumbnail', '')
                          : get(m, 'thumbnail', '')
                      "
                      alt
                    />
                  </a>
                </div>
                <div class="map-info_content" @click="toDetail(m)">
                  <a
                    class="map-info_content_title"
                    target="_blank"
                    :href="getUrlDetail(m)"
                  >
                    {{
                      get(m, 'name', '')
                        ? get(m, 'name', '')
                        : get(m, 'productName', '')
                    }}
                  </a>
                  <div class="map-info_content_vote">
                    <AppStars
                      :stars="getRate(m)"
                      :size="11"
                    />
                    ({{ getNumberRate(m) }})
                  </div>
                  <div
                    class="map-info_content_address"
                    v-if="get(m, 'address', false)"
                  >
                    <IconPin />
                    {{ get(m, 'address', '') }}
                  </div>
                  <strong class="map-info_content_price secondary">
                    {{ get(m, type == PRODUCT_TYPE.RESTAURANT ? 'from_price' : 'price', 0) | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }}
                  </strong>
                </div>
              </div>
            </l-tooltip>
          </l-marker>
        </l-map>

        <LeafletDirection v-if="showDirect" :map="current" :height="height" />
      </client-only>
    </div>

    <ShareThis
      :url="baseUrl + getUrlDetail()"
      :title="get(current, 'name', '')"
      :tag="get(current, 'name', '')"
      :description="get(current, 'name', '')"
      :width="600"
      centered
      v-model="openShareThis"
      @cancel="openShareThis = false"
    />
  </div>
</template>

<script>
import IconPin from '~/assets/icons/pin2.svg?inline';
import IconPlan from '~/assets/icons/plan.svg?inline';
import IconHeart from '~/assets/icons/heart-outline.svg?inline';
import IconHeartFilled from '~/assets/icons/heart-filled.svg?inline';
import AppStars from '~/components/app/AppStars';
import GoogleMap from '~/components/pages/common/GoogleMap';
import ShareThis from '~/components/pages/common/ShareThis';
import IconShare from '~/assets/icons/share-outline.svg?inline';
import { PRODUCT_TYPE } from '~/utils/constants';
import { get } from 'lodash';
import { mapActions, mapGetters } from 'vuex';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import LeafletDirection from '~/components/pages/common/LeafletDirection';
import MapSearch from '~/components/pages/common/MapSearch';

const pinBlack = require('~/assets/images/pin-gray.png');
const pinRed = require('~/assets/images/pin-red.png');

export default {
  name: 'GoogleMaps',

  components: {
    AppStars,
    GoogleMap,
    IconPin,
    IconPlan,
    IconHeart,
    IconHeartFilled,
    ShareThis,
    IconShare,
    MapSearch
  },

  props: {
    classes: String,
    markers: {
      type: [Object, Array],
      required: false
    },
    width: {
      type: [String, Number],
      default: 450,
      required: false
    },
    type: {
      type: [String, Number],
      required: false
    },
    loading: {
      type: [Boolean, Number, String],
      required: false
    },
    activeProp: {
      type: [Object, Array],
      required: false
    },
    height: {
      type: Number,
      default: 375
    }
  },

  data() {
    return {
      PRODUCT_TYPE,
      srcBlack: pinBlack,
      srcRed: pinRed,
      activeTab: this.type,
      tabs: [],
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      openShareThis: false,
      current: this.markers[0] ? this.markers[0] : { lat: 0, lon: 0 },
      favorite: this.markers[0]
        ? this.type == PRODUCT_TYPE.PRODUCT
          ? get(this.markers[0], 'isFavorite', false)
          : get(this.markers[0], 'is_favorite', false)
        : 0,
      showDirect: false,
      searchAddressInput: '',
      loadingFavorite: false,
      selected: 0,
      iconSize: 38,
	  distance: 1500,
      active: this.markers[0] ? this.markers[0] : {},
	  isDeskop: false
    };
  },

  computed: {
	...mapGetters('common/common', ['currentExchangeRate','currentUnitCode']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    ...mapGetters('home/home', ['getAroundLocations']),
    ...mapGetters('aroundLocation/aroundLocation', ['mapLoading']),
    dynamicSize() {
      return [this.iconSize, this.iconSize];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize / 2];
    },
    markersData() {
      let markers = [...this.markers];
      if (markers.length > 0)
        markers = this.array_move(markers, this.selected, 0);
      return markers;
    }
  },

  watch: {
    type(newValue) {
      this.activeTab = newValue;
      this.showDirect = false;
	  this.map.eachLayer(function (layer) {
		layer.closePopup();
	  });
      this.getMap();
    },
    activeProp: {
      deep: true,
      handler(newValue) {
        this.active = newValue;
      }
    }
  },

  methods: {
    get,
    ...mapActions('favorite/favorite', ['postFavorite']),
	
	checkDeskop () {
		if( 1 < 992 ) {
			this.isDeskop = false;
		} else {
			this.isDeskop = true;
		}
	},
	
	handleZoom(e) {
		this.map.eachLayer(function (layer) {
		  layer.closePopup();
		});
		let zoom = parseInt(e.target.getZoom());
		if (zoom > 15) this.distance = 1500/(zoom - 14);
		else if (zoom < 15) this.distance = 1500*(16 - zoom);
		else this.distance = 1500;
		
		this.getMap();
	},
	
	getRate(e) {
		if (this.type == PRODUCT_TYPE.PRODUCT) return get(e, 'rateScore', '')
		if (this.type == PRODUCT_TYPE.HOTEL) return get(e, 'vote', '')
		if (this.type == PRODUCT_TYPE.RESTAURANT) return get(e, 'rate', '')
	},
	getNumberRate(e) {
		if (this.type == PRODUCT_TYPE.PRODUCT) return get(e, 'rateNumber', '')
		if (this.type == PRODUCT_TYPE.HOTEL) return get(e, 'number_votes', '')
		if (this.type == PRODUCT_TYPE.RESTAURANT) return get(e, 'number_of_rate', '')
	},
	
    search(place) {
      this.active = {};
      this.map.eachLayer(function (layer) {
        layer.closePopup();
      });
      this.current = place;
      this.getMap();
    },

    doSomethingOnReady(e) {
      this.map = e;
    },

    src(marker) {
      let check =
        get(marker, 'lat', 0) == get(this.active, 'lat', 1) &&
        get(marker, 'lon', 0) == get(this.active, 'lon', 1);
      let check2 =
        get(marker, 'lat', 0) == get(this.current, 'lat', 1) &&
        get(marker, 'lon', 0) == get(this.current, 'lon', 1);
      return check | check2 ? this.srcRed : this.srcBlack;
    },

    classIcon(marker) {
      let check =
        get(marker, 'lat', 0) == get(this.active, 'lat', 1) &&
        get(marker, 'lon', 0) == get(this.active, 'lon', 1);
      let check2 =
        get(marker, 'lat', 0) == get(this.current, 'lat', 1) &&
        get(marker, 'lon', 0) == get(this.current, 'lon', 1);
      return check | check2 ? 'active' : '';
    },

    array_move(arr, index_1, index_2) {
      if (index_1 > arr.length) index_1 = arr.length;

      let temp = arr[index_1];
      arr[index_1] = arr[index_2];
      arr[index_2] = temp;

      return arr;
    },

    async handelFavorite(e, isFavorite) {
      const self = this;
      if (this.isAuthenticated) {
        if (this.loadingFavorite) return;
        this.loadingFavorite = true;

        const params = {
          id: self.current ? self.getProductId(e) : self.getProductId(e),
          type: self.type,
          isFavorite: isFavorite
        };
        const res = await this.postFavorite(params);

        if (res.code === RES_STATUS_SUCCESS) {
          this.$toast.global.primary(
            isFavorite
              ? 'Đã xoá khỏi danh sách yêu thích'
              : 'Đã lưu vào danh sách yêu thích'
          );
          this.favorite = !this.favorite;
          this.getMap();
        } else {
          this.$toast.error(res.message);
        }
        this.loadingFavorite = false;
      } else {
        this.$toast.error(this.$t('home.not_login'));
      }
    },

    direct(e) {
      this.showDirect = true;
    },

    share(e) {
      this.openShareThis = true;
    },

    clickTab(e) {
      this.activeTab = e;
      this.showDirect = false;
      this.getMap();
    },

    getMap() {
      this.$emit('getmap', { ...this.current, type: this.activeTab, distance: this.distance });
    },

    toDetail() {
      let route = this.$router.resolve({ path: this.getUrlDetail() });
      window.open(route.href, '_blank');
    },
    getUrlDetail() {
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        return (
          '../restaurant/detail/' + get(this.current, 'restaurant_id', '')
        );
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        return '../../hotel/detail/' + get(this.current, 'hotel_id', '');
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        return '../product-travel/detail/' + get(this.current, 'id', '');
      }
      return '#';
    },

    getProductId(marker) {
      if (this.activeTab == PRODUCT_TYPE.RESTAURANT) {
        return marker.restaurant_id;
      }
      if (this.activeTab == PRODUCT_TYPE.HOTEL) {
        return marker.hotel_id;
      }
      if (this.activeTab == PRODUCT_TYPE.PRODUCT) {
        return marker.id;
      }
    },

    handelHover(m, index, e) {
      this.active = m;
      if (this.getProductId(m) != this.getProductId(this.current)) {
        this.map.eachLayer(function (layer) {
          layer.closePopup();
        });
      }
    },

    async selectItem(m, index, e) {
      if (!e) {
        this.map.eachLayer(function (layer) {
          layer.closePopup();
        });
      }
      this.selected = index;
      this.active = m;
      this.current = m;
      this.favorite =
        this.type == PRODUCT_TYPE.PRODUCT
          ? get(this.current, 'isFavorite', false)
          : get(this.current, 'is_favorite', false);
      this.getMap();
      const element = document.getElementsByClassName('common_search-form')[0];
      window.scrollTo(0, element.offsetTop + 139 - 80);
    },

    async handleDragEnd(e) {
		this.map.eachLayer(function (layer) {
		  layer.closePopup();
		});
      await this.$nextTick(() => {
        e.target.closePopup();
      });
      this.current = {
        lat: get(e.target.getCenter(), 'lat', 0),
        lon: get(e.target.getCenter(), 'lng', 0)
      };
      await this.getMap();
    },
	
	handleScroll() {
		let elem = this.$refs.myBtn;
		elem.focus();
	},
	
  },
  mounted() {
	window.addEventListener('scroll', this.handleScroll);
  },
  
  created(){
	this.checkDeskop();
  },
	  
  beforeDestroy() {
	window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_leaflet-maps.scss';
</style>
