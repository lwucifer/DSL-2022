<template>
  <div class="leaflet-maps animated fadeIn" :class="classes">
    <div>
      <div v-if="showDirect" class="leaflet-maps_direction">
        <v-button
          title="Quay lại"
          @click="showDirect = false"
          class="leaflet-map_close"
        >
          <span></span>
        </v-button>
      </div>

      <div id="map-wrap" :class="loading ? 'loading' : ''" style="height: 400px">
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
            @dragend="handleDragEnd"
            @zoom="handleZoom"
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
              :lat-lng="[get(m,'lat',0), get(m,'lon',0)]"
              :key="index"
              v-for="(m, index) in markers"
            >
              <l-icon
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
                :icon-url="src(m)"
                :class-name="classIcon(m)"
              />
			        <!-- popup -->
              <l-popup v-show="!loading">
                <div class="map-info  a">
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
                    <a target="_blank" :href="getUrlDetail(current)" class="thumbnail">
                      <img :src="get(current, 'default_thumbnail', false) ? get(current, 'default_thumbnail', '') : get(current, 'thumbnail', '')" alt />
                    </a>
                  </div>
                  <div class="map-info_content" @click="toDetail(current)">
                    <a
                      class="map-info_content_title"
                      target="_blank"
                      :href="getUrlDetail(current)"
                    >
                      {{ get(current, 'name', '') }}
                    </a>
                    <div class="map-info_content_vote">
                      <AppStars :stars="get(current, 'vote', 0)" :size="11" />
                      ({{ get(current, 'number_votes', 0) }})
                    </div>
                    <div class="map-info_content_address" v-if="get(current, 'address', false)">
                      <IconPin />
                      {{ get(current, 'address', '') }}
                    </div>
                    <strong class="map-info_content_price secondary">
                      {{ get(current, 'price', 0) | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }}
                    </strong>
                  </div>
                </div>
              </l-popup>
              <!-- tooltip -->
              <l-tooltip :options="{direction: 'top', opacity: 1}">
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
                        :class="{ active: type == PRODUCT_TYPE.PRODUCT ? get(m, 'isFavorite', false) : get(m, 'is_favorite', false) }"
                        :title="
                          (type == PRODUCT_TYPE.PRODUCT ? get(m, 'isFavorite', false) : get(m, 'is_favorite', false))
                            ? 'Xóa khỏi danh sách yêu thích'
                            : 'Thêm vào danh sách yêu thích'
                        "
                        @click.prevent="handelFavorite(m, type == PRODUCT_TYPE.PRODUCT ? get(m, 'isFavorite', false) : get(m, 'is_favorite', false))"
                      >
                        <IconHeartFilled class="icon" v-if="type == PRODUCT_TYPE.PRODUCT ? get(m, 'isFavorite', false) : get(m, 'is_favorite', false)" />
                        <IconHeart class="icon" v-else />
                      </a>
                    </div>
                    <a target="_blank" :href="getUrlDetail(m)" class="thumbnail">
                      <img :src="get(m, 'default_thumbnail', false) ? get(m, 'default_thumbnail', '') : get(m, 'thumbnail', '')" alt />
                    </a>
                  </div>
                  <div class="map-info_content" @click="toDetail(m)">
                    <a
                      class="map-info_content_title"
                      target="_blank"
                      :href="getUrlDetail(m)"
                    >
                      {{ get(m, 'name', '') }}
                    </a>
                    <div class="map-info_content_vote">
                      <AppStars :stars="get(m, 'vote', 0)" :size="11" />
                      ({{ get(m, 'number_votes', 0) }})
                    </div>
                    <div class="map-info_content_address" v-if="get(m, 'address', false)">
                      <IconPin />
                      {{ get(m, 'address', '') }}
                    </div>
                    <strong class="map-info_content_price secondary">
                      {{ get(m, 'price', 0) | priceTransform(currentExchangeRate) | numeralFormat }} {{ currentUnitCode }}
                    </strong>
                  </div>
                </div>
              </l-tooltip>
            </l-marker>
          </l-map>

          <LeafletDirection v-if="showDirect" :map="current" :height="400"/>
        </client-only>
      </div>
    </div>

    <ul class="related-address animated fadeIn">
      <li
        @click="selectItem(item, index)"
		@mouseover="hoverItem(item, index)"
		@mouseout="active = {}"
        v-for="(item, index) in markersOrigin"
        :key="index"
      >
        <p class="address-name mb-0">{{ get(item,'name', '') }}</p>
        <p class="mb-0 secondary">
          {{ getDistance(center, item) }} Km
        </p>
      </li>
    </ul>

    <ShareThis
      :url="baseUrl + getUrlDetail(current)"
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
import ShareThis from '~/components/pages/common/ShareThis';
import LeafletDirection from '~/components/pages/common/LeafletDirection';
import IconShare from '~/assets/icons/share-outline.svg?inline';
import { PRODUCT_TYPE } from '~/utils/constants';
import { mapActions, mapGetters } from 'vuex';
import { get } from 'lodash';
import { RES_STATUS_SUCCESS } from '~/utils/configs';
import MapSearch from '~/components/pages/common/MapSearch';

const pinBlack = require('~/assets/images/pin-gray.png');
const pinRed = require('~/assets/images/pin-red.png');

export default {
  name: 'leafletMapsAround',
  components: {
    AppStars,
    IconPin,
    IconPlan,
    IconHeart,
    IconHeartFilled,
    ShareThis,
    IconShare,
    LeafletDirection,
    MapSearch
  },

  props: {
    classes: String,
    center: {
      type: [Object, Array],
      required: false
    },
    height: {
      type: [String, Number],
      default: 400,
      required: false
    },
    width: {
      type: [String, Number],
      default: 1200,
      required: false
    },
    type: {
      type: [String, Number],
      required: false
    }
  },

  data() {
    return {
	  PRODUCT_TYPE,
      map: null,
      srcBlack: pinBlack,
      srcRed: pinRed,
      map: null,
      baseUrl: process.env.BASE_ORIGIN_LOCATION,
      markers: [],
      openShareThis: false,
      loading: false,
      loadingFavorite: false,
      showDirect: false,
      current: this.center,
      favorite: this.type == PRODUCT_TYPE.PRODUCT ? get(this.current, 'isFavorite', false) : get(this.current, 'is_favorite', false),
      searchAddressInput: '',
      position: null,
      selected: 0,
      active: this.center,
      iconSize: 38,
      distance: 1100,
      markersOrigin: []
    };
  },

  computed: {
	...mapGetters('common/common', ['currentExchangeRate','currentUnitCode']),
    ...mapGetters('auth/auth', ['isAuthenticated']),
    dynamicSize() {
      return [this.iconSize, this.iconSize];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize / 2];
    },
  },

  watch: {
    type() {
      this.current = this.center;
      this.showDirect = false;
	  this.map.eachLayer(function (layer) {
	    layer.closePopup();
	  });
      this.getMap();
    }
  },

  mounted() {
    this.getMap();
  },

  methods: {
    get,
    ...mapActions('aroundLocation/aroundLocation', [
      'getAroundLocationRestaurant',
      'getAroundLocationHotel',
      'getAroundLocationProduct'
    ]),
    ...mapActions('favorite/favorite', ['postFavorite']),
	
    handleZoom(e) {
		this.map.eachLayer(function (layer) {
		  layer.closePopup();
		});
		let zoom = parseInt(e.target.getZoom());
		if (zoom > 15) this.distance = 1100/(zoom - 14);
		else if (zoom < 15) this.distance = 1100*(16 - zoom);
		else this.distance = 1100;
		
		this.getMap();
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
      this.map = e
    },

    src(marker) {
      let check = (get(marker, 'lat', 0) == get(this.active, 'lat', 1)) && (get(marker, 'lon', 0) == get(this.active, 'lon', 1));
      let check2 = (get(marker, 'lat', 0) == get(this.current, 'lat', 1)) && (get(marker, 'lon', 0) == get(this.current, 'lon', 1));
      return check | check2 ? this.srcRed : this.srcBlack;
    },
    classIcon (marker) {
      let check = (get(marker, 'lat', 0) == get(this.active, 'lat', 1)) && (get(marker, 'lon', 0) == get(this.active, 'lon', 1));
	  let check2 = (get(marker, 'lat', 0) == get(this.current, 'lat', 1)) && (get(marker, 'lon', 0) == get(this.current, 'lon', 1));
      return check | check2 ? 'active' : '';
    },

    array_move(arr, index_1, index_2) {
      if (index_1 > arr.length) index_1 = arr.length;

      let temp = arr[index_1];
      arr[index_1] = arr[index_2];
      arr[index_2] = temp;

      return arr
    },

    async getMap() {
		console.log(111111);
      if (this.loading) return false;
		console.log(2222222);
      this.loading = true;
      let lat = get(this.current, 'lat', false)
        ? get(this.current, 'lat', 0)
        : get(this.center, 'lat', 0);
      let lon = get(this.current, 'lon', false)
        ? get(this.current, 'lon', 0)
        : get(this.center, 'lon', 0);
      let params = { lat: lat, lon: lon, distance: this.distance };
      let res = [];
		
	  console.log(params);
	  
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        res = await this.getAroundLocationRestaurant(params);
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        res = await this.getAroundLocationHotel(params);
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        res = await this.getAroundLocationProduct(params);
      }

	  this.markersOrigin = [...get(res, 'data', [])];
      let markers = get(res, 'data', []);
      if(markers.length > 0 ) markers = this.array_move(markers, this.selected, 0);
      this.markers = markers;
      this.loading = false;
    },

    handelHover(m, index, e) {
      this.active = m;
	  if (this.getProductId(m) != this.getProductId(this.current)) {
		  this.map.eachLayer(function (layer) {
			layer.closePopup();
		  });
	  }
    },
	
	hoverItem(m, index) {
	  this.map.eachLayer(function (layer) {
	   layer.closePopup();
	  });
      this.active = m;
    },

    async selectItem(m, index, e) {
      if(!e) {
        this.map.eachLayer(function (layer) {
          layer.closePopup();
        });
      }
      this.selected = index;
      this.active = m;
      this.current = m;
      this.favorite = this.type == PRODUCT_TYPE.PRODUCT ? get(this.current, 'isFavorite', false) : get(this.current, 'is_favorite', false);
      await this.getMap();
    },

    async handleDragEnd(e) {
		this.map.eachLayer(function (layer) {
		  layer.closePopup();
		});
      await this.$nextTick(() => {
        e.target.closePopup();
      });
      this.current = {
        lat: get(e.target.getCenter(),'lat', 0),
        lon: get(e.target.getCenter(),'lng', 0)
      };
      await this.getMap();
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

    getProductId(marker) {
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        return marker.restaurant_id;
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        return marker.hotel_id;
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        return marker.id;
      }

      return '';
    },

    toDetail(m) {
      let route = this.$router.resolve({ path: this.getUrlDetail(m) });
      window.open(route.href, '_blank');
    },
    getUrlDetail(m) {
      if (this.type == PRODUCT_TYPE.RESTAURANT) {
        return '../../restaurant/detail/' + get(m, 'restaurant_id', '');
      }
      if (this.type == PRODUCT_TYPE.HOTEL) {
        return '../../hotel/detail/' + get(m, 'hotel_id', '');
      }
      if (this.type == PRODUCT_TYPE.PRODUCT) {
        return '../../product-travel/detail/' + get(m, 'id', '');
      }
      return '#';
    },

    rad(x) {
      return (x * Math.PI) / 180;
    },
    roundToTwo(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    },
    getDistance(p1, p2) {
      if(p1 && p2) {
        const R = 6378.137;
        const dLat = this.rad(p2.lat - p1.lat);
        const dLong = this.rad(p2.lon - p1.lon);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.rad(p1.lat)) *
            Math.cos(this.rad(p2.lat)) *
            Math.sin(dLong / 2) *
            Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return this.roundToTwo(d);
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_leaflet-maps.scss';
</style>