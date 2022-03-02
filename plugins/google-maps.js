import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB-z7KZftXHQ6qQ-Nt-WWRyO53rSTZEcdw',
    libraries: "places",
    region: 'VI',
    language: 'vi',
    provideRouteAlternatives: true
  }
});