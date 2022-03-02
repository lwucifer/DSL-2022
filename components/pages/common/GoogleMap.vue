<template>
  <div class="google-map" :class="classes">
    <v-button 
      v-if="!openNavigation" 
      @click="openNavigation = true" 
      class="btn-open-navigation" 
      variant="primary" 
      :title="$t('hotel.option')"
    >
      <IconMenu class="icon"/>
    </v-button>

    <div class="google-map_navigation" :class="openNavigation ? 'open-navigation' : ''">
      <div class="blue" v-if="!showDetail">
        <ul class="google-map_mode">
          <li @click="mode = ''" :class="mode == '' ? 'active' : ''" :title="$t('hotel.recommend')">
            <IconDirection class="icon"/>
          </li>
          <li @click="mode = 'DRIVING'" :class="mode == 'DRIVING' ? 'active' : ''" :title="$t('hotel.drive')">
            <IconCar class="icon"/>
          </li>
          <li @click="mode = 'WALKING'" :class="mode == 'WALKING' ? 'active' : ''" :title="$t('hotel.warking')">
            <IconWalking class="icon"/>
          </li>
          <li @click="mode = 'TRANSIT'" :class="mode == 'TRANSIT' ? 'active' : ''" :title="$t('hotel.public_transport')">
            <IconBus class="icon"/>
          </li>
          <li :class="mode == 'BICYCLING' ? 'active' : 'disabled'" :title="$t('hotel.bicycling')">
            <IconBike class="icon"/>
          </li>
          <li><v-button @click="openNavigation = false" class="btn-close-navigation" title="Đóng"><IconClose class="icon"/></v-button></li>
        </ul>
        <div class="google-map_form">
          <div class="d-flex-center">
            <IconPin class="icon icon-pin"/>
            <gmap-autocomplete
              :placeholder="$t('hotel.select_departure_point')"
              @place_changed="setPlace">
            </gmap-autocomplete>
          </div>

          <div class="google-map_waypoints">
            <div v-for="(item, key) in points" :key="key" class="google-map_waypoints_waypoint">
              <IconPin class="icon icon-pin"/>
              <gmap-autocomplete
                :placeholder="$t('hotel.location_stop')"
                :value="textPoints[key] ? textPoints[key] : ''"
                @place_changed="(e)=>setPoint(e, key)">
              </gmap-autocomplete>
              <v-button class="remove_point" @click="removePoint(key)" size="sm"><IconClose class="icon"/></v-button>
            </div>
          </div>
          <v-button class="add_point mt-4" size="sm" @click="addPoint()" v-if="points == waypoints.length">
            <span><IconAdd class="icon"/></span>
            {{$t("hotel.add_location_stop")}}
          </v-button>
        </div> 
        <div class="google-map_setting">
          <div class="google-map_setting_option">
            <SelectWithCheckbox
              v-model="avoid"
              :placeholder="$t('hotel.avoid')"
              :options="avoids"
              mode="multiple"
              size="sm"
              class="transparent mr-2"
            />
            <SelectWithCheckbox
              v-model="unit"
              :placeholder="$t('home.distance_unit')"
              :options="units"
              size="sm"
              class="transparent"
            />
          </div>
        </div>
      </div>
      <div class="google-map_routes" v-if="routes.length == 0 && !showDetail">
        <p class="pl-3 pr-3">Phương tiện không khả dụng</p>
      </div>
      <div class="google-map_routes" v-if="routes.length > 0 && !showDetail">
        <div
          v-for="(item, key) in routes" :key="key" 
          class="google-map_routes_route"
          :class="key == route ? 'active' : ''"
          @click.prevent="selectRoute(key)"
        >
          <div class="summary">
            <div>
              <IconBus class="icon" v-if="mode == 'TRANSIT'"/>
              <IconWalking class="icon" v-else-if="mode == 'WALKING'"/>
              <IconBike class="icon" v-else-if="mode == 'BICYCLING'"/>              
              <IconCar class="icon" v-else/>
            </div>
            <div>
              <p v-if="item.summary">Qua {{item.summary}}</p>
              <a href="" v-if="key == route" title="Chi tiết" @click.prevent="showDetail = true">Chi tiết</a>
            </div>
          </div>
          <div class="info">
            <p class="duration">{{get(item, 'legs[0].duration.text', 0)}}</p>
            <p class="distance">{{get(item, 'legs[0].distance.text', 0)}}</p>
          </div>
        </div>
      </div>

      <div class="google-map_detail" v-if="showDetail">
        <div class="google-map_detail_summary">
          <div>
            <h5 class="duration">
              {{get(contentDetail, 'legs[0].duration.text', 0)}} <span>({{get(contentDetail, 'legs[0].distance.text', 0)}})</span>
            </h5>
            <span v-if="get(contentDetail, 'summary', false)">qua {{get(contentDetail, 'summary', '')}}</span>
          </div>
          <a href="" title="Quay lại" @click.prevent="showDetail = false"><IconClose class="icon"/></a>
        </div>
        <h5 class="google-map_detail_start">{{get(contentDetail, 'legs[0].start_address', '')}}</h5>
        <div class="google-map_detail_steps">
          <div
            v-for="(item, key) in get(contentDetail, 'legs[0].steps', false)" :key="key" 
            class="google-map_detail_steps_step"
          >
            <div>
              <strong class="index">{{key+1}}.</strong> <span v-html="item.instructions"></span>
            </div>
            <div class="duration">
              <span v-html="item.duration.text"></span> (<span v-html="item.distance.text"></span>)
            </div>
          </div>
        </div>
        <h5 class="google-map_detail_end">{{get(contentDetail, 'legs[0].end_address', '')}}</h5>
      </div>
    </div>

    <!-- <iframe class="google-map_iframe" :src="url" :width="width" :height="height" frameborder="0" style="border:0" allowfullscreen=""></iframe> -->
    <div class="google-map_short-info">
      {{get(contentDetail, 'legs[0].duration.text', 0)}} <span>({{get(contentDetail, 'legs[0].distance.text', 0)}})</span>
    </div>
    <GmapMap 
      :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUi: false
        }"
      :zoom="11" :center="destination" :style="'width:100%; height: ' + height +'px'" ref="googleMap">
      <gmap-marker :position="origin"/>
      <gmap-marker :position="destination"/>
      <DirectionsRenderer 
        :travelMode="mode" 
        :unitSystem="unitSystem" 
        :route="route" 
        :waypoints="waypoints" 
        :origin="origin" 
        :destination="destination"
        :avoidFerries="avoid.includes('ferries')"
        :avoidHighways="avoid.includes('highways')"
        :avoidTolls="avoid.includes('tolls')"
        @result="handeResult"
      />
    </GmapMap>

  </div>
</template>

<script>
import IconLeft from '~/assets/icons/left-arrow-2.svg?inline';
import IconMenu from '~/assets/icons/menu.svg?inline';
import IconCar from '~/assets/icons/car.svg?inline';
import IconBus from '~/assets/icons/bus.svg?inline';
import IconWalking from '~/assets/icons/walking.svg?inline';
import IconDirection from '~/assets/icons/direction.svg?inline';
import IconBike from '~/assets/icons/bike.svg?inline';
import IconAdd from '~/assets/icons/add.svg?inline';
import IconClose from '~/assets/icons/close.svg?inline';
import IconPin from '~/assets/icons/pin2.svg?inline';
import DirectionsRenderer from '~/plugins/DirectionsRenderer';

import {get} from 'lodash';

export default {
  name: "GoogleMap",

  components: {
    IconLeft,
    IconMenu,
    IconWalking,
    IconBus,
    IconCar,
    IconBike,
    IconClose,
    IconAdd,
    IconPin,
    IconDirection,
    DirectionsRenderer
  },

  props: {
    classes: String,
    open: {
      type: Boolean,
      default: false,
      required: false
    },
    map: {
      type: Object,
      default: {},
      required: true
    },
    height: {
      type: [String, Number],
      default: 890,
      required: false
    },
    width: {
      type:[String, Number],
      default: 450,
      required: false
    }
  },

  data() {
    return {
      route: 0,
      routes: [],
      contentDetail: {},
      showDetail: false,
      openNavigation: this.open,
      position: null,
      start: null,
      points: 0,
      textPoints: [],
      waypoints: [],
      unit: "METRIC",
      units: [
        {
          value: "METRIC",
          text: "Km"
        },
        {
          value: "IMPERIAL",
          text: this.$t('hotel.mile')
        }
      ],
      mode: "DRIVING",
      avoid: [],
      avoids: [
        {
          value: "ferries",
          text: this.$t('hotel.ferry')
        },
        {
          value: "tolls",
          text: this.$t('hotel.toll_road')
        },
        {
          value: "highways",
          text: this.$t('hotel.free_way')
        }
      ],
    };
  },

  mounted() {
    this.getLocation();
  },

  watch: {
    changeData(newValue, oldValue) {
      this.route = 0
    }
  },

  computed: {
    changeData() {
      const {mode, waypoints, avoid, map, start, position} = this
      return {mode, waypoints, avoid, map, start, position}
    },

    origin() {
      if (this.start) return { query: this.start }
      if (this.position) return { lat: this.position.latitude, lng: this.position.longitude }
      return { lat: this.map.lat, lng: this.map.lon }
    },
    destination() {
      return { lat: this.map.lat, lng: this.map.lon }
    },

    waypoint() {
      let waypoint = this.waypoints.reduce((accumulator, currentValue, currentIndex, array) => {
        let sec = currentIndex > 0 && get(currentValue,'ll', false) ? '|' : '';
        return accumulator = accumulator + sec + get(currentValue,'ll', '');
      },"")

      return waypoint.length > 0 ? "&waypoints=" + waypoint : "";
    },

    unitSystem() {
      return this.unit == 'IMPERIAL' ? google.maps.UnitSystem.IMPERIAL : google.maps.UnitSystem.METRIC
    },

    url() {
      let url = "https://www.google.com/maps/embed/v1/place?key=" + process.env.GG_MAP_KEY + "&q=" + this.map.lat + "," + this.map.lon + "&language=vi&zoom=12";
      
      let avoid = get(this, 'avoid.length', 0) > 0 ? "&avoid=" + this.avoid.toString().replace(",", "|").toString().replace(",", "|") : '';
      let mode = this.mode ? "&mode=" + this.mode : "";
      if (this.position || this.start) {
        let start = this.start ? this.start : this.position.latitude + "," + this.position.longitude;
        url = "https://www.google.com/maps/embed/v1/directions?key=" + process.env.GG_MAP_KEY
                + "&language=vi&region=VI"
                + "&origin=" + start
                + "&destination=" + this.map.lat  + "," + this.map.lon
                + "&units=" +  this.unit
                + this.waypoint
                + mode
                + avoid;
      }
      return url;
    },
  },

  methods: {
    get,

    handeResult(data) {
      this.dataRoutes = data;
      this.routes = get(data, 'routes', []);
      this.contentDetail = this.routes[this.route];
    },
    selectRoute(index) {
      this.route = index;
      this.contentDetail = this.routes[index];
    },
    
    addPoint() {
      if (this.points < 20 && this.points == this.waypoints.length) this.points++;
    },
    removePoint(key) {
      this.points--;
      this.waypoints.splice(key, 1);
      this.textPoints.splice(key, 1);
    },
    setPoint(place, key) {
      if(place) {
        this.textPoints.push(place.formatted_address);
        this.waypoints.push({
          location: place.geometry.location.lat() +','+ place.geometry.location.lng(),
          stopover: false,
        })
      }
    },

    setPlace(place) {
      this.start = place.formatted_address;
    },

    getLocation() {
      if(navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(position){
          self.position = position.coords;
        })
      } else {
      }
    },
  },
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_google-map.scss';
</style>