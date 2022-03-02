<template>
  <div class="leaflet-map" :class="classes">
    <v-button
      v-if="!openNavigation"
      @click="openNavigation = true"
      class="btn-open-navigation"
      variant="primary"
      :title="$t('hotel.option')"
    >
      <IconMenu class="icon" />
    </v-button>

    <div
      class="leaflet-map_navigation"
      :class="openNavigation ? 'open-navigation' : ''"
    >
      <div class="blue">
        <ul class="leaflet-map_mode">
          <li
            @click="mode = ''"
            :class="mode == '' ? 'active' : ''"
            :title="$t('hotel.recommend')"
          >
            <IconDirection class="icon" />
          </li>
          <li
            @click="mode = 'routed-car'"
            :class="mode == 'routed-car' ? 'active' : ''"
            :title="$t('hotel.drive')"
          >
            <IconCar class="icon" />
          </li>
          <li
            @click="mode = 'routed-foot'"
            :class="mode == 'routed-foot' ? 'active' : ''"
            :title="$t('hotel.warking')"
          >
            <IconWalking class="icon" />
          </li>
          <!-- <li
            @click="mode = 'transit'"
            :class="mode == 'transit' ? 'active' : ''"
            :title="$t('hotel.public_transport')"
          >
            <IconBus class="icon" />
          </li> -->
          <li
            @click="mode = 'routed-bike'"
            :class="mode == 'routed-bike' ? 'active' : ''"
            :title="$t('hotel.bicycling')"
          >
            <IconBike class="icon" />
          </li>
          <li>
            <v-button
              @click="openNavigation = false"
              class="btn-close-navigation"
              title="Đóng"
              ><IconClose class="icon"
            /></v-button>
          </li>
        </ul>
        <div class="leaflet-map_form">
          <div class="d-flex-center">
            <IconPin class="icon icon-pin" />
            <MapSearch @input="setPlace" :placeholder="$t('hotel.select_departure_point')"/>
          </div>

          <div class="leaflet-map_waypoints">
            <div
              v-for="(item, key) in points"
              :key="key"
              class="leaflet-map_waypoints_waypoint"
            >
              <IconPin class="icon icon-pin" />
              <MapSearch @input="setPoint" :placeholder="$t('hotel.add_location_stop')"/>
              <v-button class="remove_point" @click="removePoint(key)" size="sm"
                ><IconClose class="icon"
              /></v-button>
            </div>
          </div>
          <v-button
            class="add_point mt-4"
            size="sm"
            @click="addPoint()"
            v-if="points == waypoints.length"
          >
            <span><IconAdd class="icon" /></span>
            {{ $t('hotel.add_location_stop') }}
          </v-button>
        </div>
        <div class="leaflet-map_setting">
          <div class="leaflet-map_setting_option">
            <!-- <SelectWithCheckbox
              v-model="avoid"
              :placeholder="$t('hotel.avoid')"
              :options="avoids"
              mode="multiple"
              size="sm"
              class="transparent mr-2"
            /> -->
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
    </div>

    <div :style="'height:' + height + 'px'">
      <client-only>
        <l-map>
          <l-tile-layer
            url="https://osrm.hcdt.vn:9000/osm/{z}/{x}/{y}.png"
          ></l-tile-layer>
          <l-routing-machine :waypoints="waypoint" :units="unit" :profile="mode ? mode : 'routed-car'"/>
        </l-map>
      </client-only>
    </div>
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
import LRoutingMachine from '~/components/pages/common/LRoutingMachine';
import { get } from 'lodash';
import MapSearch from '~/components/pages/common/MapSearch';

const pinRed = require('~/assets/images/pin-red.png');

export default {
  name: 'LeafletMap',

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
    LRoutingMachine,
    MapSearch
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
      type: [String, Number],
      default: 450,
      required: false
    }
  },

  data() {
    return {
	  src: pinRed,
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
      unit: 'metric',
      units: [
        {
          value: 'metric',
          text: 'Km'
        },
        {
          value: 'imperial',
          text: this.$t('hotel.mile')
        }
      ],
      mode: 'routed-car',
      avoid: [],
      avoids: [
        {
          value: 'ferries',
          text: this.$t('hotel.ferry')
        },
        {
          value: 'tolls',
          text: this.$t('hotel.toll_road')
        },
        {
          value: 'highways',
          text: this.$t('hotel.free_way')
        }
      ]
    };
  },

  mounted() {
    this.getLocation();
  },

  watch: {
    changeData(newValue, oldValue) {
      this.route = 0;
    }
  },

  computed: {
    changeData() {
      const { mode, waypoints, avoid, map, start, position } = this;
      return { mode, waypoints, avoid, map, start, position };
    },

    origin() {
      if (this.start) return this.start;
      if (this.position) return { lat: this.position.latitude, lng: this.position.longitude };
      return { lat: this.map.lat, lng: this.map.lon };
    },
    destination() {
      return { lat: this.map.lat, lng: this.map.lon };
    },

    waypoint() {
      if (this.waypoints.length > 0) {
        return [this.origin, ...this.waypoints, this.destination]
      }
      return [this.origin, this.destination]
    }
  },

  methods: {
    get,

    addPoint() {
      if (this.points < 20 && this.points == this.waypoints.length)
        this.points++;
    },
    removePoint(key) {
      this.points--;
      this.waypoints.splice(key, 1);
      this.textPoints.splice(key, 1);
    },
    setPoint(place) {
      if (place) {
        this.textPoints.push(place.name);
        this.waypoints.push({
          lat: place.lat,
          lng: place.lon,
          text: place.name
        });
      }
    },

    setPlace(place) {
      this.start = {
          lat: place.lat,
          lng: place.lon,
          text: place.name
        }
    },

    getLocation() {
      if (navigator.geolocation) {
        var self = this;
        navigator.geolocation.getCurrentPosition(function (position) {
          self.position = position.coords;
        });
      } else {
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/pages/common/_leaflet-map.scss';
</style>