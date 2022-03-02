<template>
  <client-only>
    <div style="display: none">
      <slot></slot>
    </div>
  </client-only>
</template>

<script>
// import L from 'leaflet';
//  import { IRouter, IGeocoder, LineOptions } from 'leaflet-routing-machine'
const props = {
  visible: {
    type: Boolean,
    default: true
  },
  waypoints: {
    type: Array,
    required: true
  },
  // router: {
  //   type: IRouter
  // },
  // plan: {
  //   type: Object
  // },
  // geocoder: {
  //   type: IGeocoder
  // },
  fitSelectedRoutes: {
    type: [String, Boolean],
    default: 'smart'
  },
  // lineOptions: {
  //   type: LineOptions
  // },
  routeLine: {
    type: Function
  },
  autoRoute: {
    type: Boolean,
    default: true
  },
  routeWhileDragging: {
    type: Boolean,
    default: false
  },
  routeDragInterval: {
    type: Number,
    default: 500
  },
  waypointMode: {
    type: String,
    default: 'connect'
  },
  useZoomParameter: {
    type: Boolean,
    default: false
  },
  showAlternatives: {
    type: Boolean,
    default: false
  },
  units: {
    type: String,
    default: 'metric'
  },
  profile: {
    type: String,
    default: 'routed-car'
  },
  // altLineOptions: {
  //   type: LineOptions
  // }
}
// const optionTestNames = [
//   'router',
//   'plan',
//   'geocoder',
//   'lineOptions',
//   'routeLine',
//   'altLineOptions'
// ]
export default {
  props,
  name: 'LRoutingMachine',
  data() {
    return {
      parentContainer: null,
      ready: false,
      layer: null,
      language: this.$i18n.locale ? this.$i18n.locale  : 'vi',
      unitNames: this.$i18n.locale == 'en' ? 
              {meters: 'm',kilometers: 'km',yards: 'yd',miles: 'mile',hours: 'h',minutes: 'min',seconds: 's'} : 
              {meters: 'm',kilometers: 'km',yards: 'thước',miles: 'dặm',hours: 'giờ',minutes: 'phút',seconds: 'giây'},
    }
  },
  mounted() {
    this.findRealParent(this.$parent)
  },
  beforeDestroy() {
    return this.layer ? this.layer.remove() : null
  },
  
  watch: {
    changeData(newValue, oldValue) {
      this.findRealParent(this.$parent, true)
    }
  },
  computed: {
    changeData() {
      const { profile, waypoints, units } = this;
      return { profile, waypoints, units };
    },
  },
  methods: {
    async findRealParent(firstVueParent, reload) {
      var found = false;
      while (firstVueParent && !found) {
        if (firstVueParent.mapObject === undefined) {
          firstVueParent = firstVueParent.$parent;
        } else {
          found = true;
        }
      }
      this.ready = true;

      await this.add(firstVueParent, reload);
    },

    add (firstVueParent, reload) {
      const self = this;
      if (process.browser) {
        if (firstVueParent._isMounted) {
          const L = require('leaflet');
          const {
            waypoints,
            fitSelectedRoutes,
            autoRoute,
            routeWhileDragging,
            routeDragInterval,
            waypointMode,
            useZoomParameter,
            showAlternatives,
            units,
            unitNames,
            profile,
            language
          } = this
          const options = {
            waypoints,
            fitSelectedRoutes,
            autoRoute,
            routeWhileDragging,
            routeDragInterval,
            waypointMode,
            useZoomParameter,
            showAlternatives,
            units,
            unitNames,
            profile,
            language
          }
          const { mapObject } = firstVueParent
          if (reload) {
            if (mapObject && self.layer) mapObject.removeControl(self.layer);
          }
          const routingLayer = L.Routing.control(options)
          routingLayer.addTo(mapObject)
          self.layer = routingLayer
        }
      }
    }
  }
}
</script>