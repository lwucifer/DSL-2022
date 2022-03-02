import { MapElementFactory } from "vue2-google-maps";

export default MapElementFactory({
  name: "directionsRenderer",

  ctr() {
    return window.google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: Object },
    destination: { type: Object },
    travelMode: { type: String },
    unitSystem: { type: [String, Number] },
    waypoints: [Array, Object],
    route: {
      type:[Number, String],
      default: 0
    },
    avoidFerries: { type: Boolean },
    avoidHighways: { type: Boolean },
    avoidTolls: { type: Boolean },
  },

  data() {
      return {
        provideRouteAlternatives: true,
        optimizeWaypoints: true,
        dataMap: {}
      }
  },

  methods: {
    result(data) {
      this.dataMap = data;
      this.$emit('result', data);
    }
  },

  afterCreate(directionsRenderer) {
    const self = this;
    let directionsService = new window.google.maps.DirectionsService();

    this.$watch(
      () => [this.route],
      () => {
        let dataRoutes = {...self.dataMap, routes: [self.dataMap.routes[self.route]]};
        directionsRenderer.setDirections(dataRoutes);
      }
    );

    this.$watch(
      () => [
        this.origin, 
        this.destination, 
        this.travelMode, 
        this.waypoints, 
        this.provideRouteAlternatives, 
        this.unitSystem, 
        this.avoidFerries, 
        this.avoidHighways, 
        this.avoidTolls
      ],
      () => {
        let { origin, destination, travelMode, waypoints, provideRouteAlternatives, unitSystem, avoidHighways, avoidFerries, avoidTolls } = this;
        if (!origin || !destination || !travelMode) return;

        directionsService.route(
          {
            origin,
            destination,
            travelMode,
            waypoints,
            unitSystem,
            avoidTolls,
            avoidFerries,
            avoidHighways,
            provideRouteAlternatives
          },
          (response, status) => {
            if (status !== "OK") {
              self.result(response);
              directionsRenderer.setDirections(response);
              return;
            }
            self.result(response);
            let dataRoutes = {...response, routes: [response.routes[self.route]]};
            directionsRenderer.setDirections(dataRoutes);
          }
        );
      }
    );
  }
});
