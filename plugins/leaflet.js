import Vue from 'vue';
import { LMap, LTileLayer, LMarker, LIcon, LTooltip } from 'vue2-leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

Vue.component('l-map', LMap);
Vue.component('l-icon', LIcon);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-tooltip', LTooltip);

if (process.browser) {
    const routing = require('../plugins/leaflet-routing-machine');
    Vue.use(routing);
}
