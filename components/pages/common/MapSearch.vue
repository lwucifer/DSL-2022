<template>
    <div class="map-search" v-click-outside="handleFocusOut">
      <v-input
          ref="vInput"
          v-bind="$attrs"
          :value="localValue"
          v-on="listeners"
          type="text"
          class="input-map"
          :placeholder="placeholder"
      >
      </v-input>
    <ul class="dropdown" v-if="open">
        <li @click="selectItem(item)" v-for="(item, index) in address" :key="index">
            {{get(item, 'address.label', '')}}
        </li>
    </ul>
  </div>
</template>

<script>
import { get } from 'lodash';
import Vue from 'vue';

Vue.directive('click-outside', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
      // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
});

export default {
  inheritAttrs: false,
  
  model: {
    event: 'input',
    prop: 'value'
  },

  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    placeholder: {
      type: [Number, String],
      default: ''
    }
  },

  data() {
    return {
      localValue: this.value || '',
      api: 'rzyJ6nI9N9mN60IP8zMM0ZaaTMJj1ThgeZBWhUqnXVs',
      address: [],
      current: '',
      open: false
    };
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.handleInput
      };
    }
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      //this.$emit('input', newValue);
    }
  },

  methods: {
    get,
    handleFocusOut() {
      this.open = false;
    },
    selectItem(item) {
        this.localValue = get(item, 'address.label', '');
        let data = {lat: get(item, 'position.lat', 0), lon: get(item, 'position.lng', 0), name: this.localValue};
        this.$emit('input', data, {});
        this.open = false;
        this.check = true;
    },
    async handleInput(value) {
      if (this.localValue === value && this.localValue.length === value.length) return

      this.localValue = value;
      this.open = false;

      let query = this.removeAccents(value);
      let url1 = 'https://nominatim.openstreetmap.org/search/?q=' + query + '&limit=5&format=json&addressdetails=1&json_callback=_l_geocoder_2';
      let url = 'https://geocode.search.hereapi.com/v1/geocode?apiKey=' + this.api + '&q=' + query + '&in=countryCode%3AVNM';

      try {
        let result = await fetch(url);
        result = await result.json();
        this.address = get(result, 'items', []);
        this.open = true;
      } catch (err) {
        return err;
      }
    },
    removeAccents(str) {
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }
  }
}
</script>

<style lang="scss">
.map-search {
    position: static;
    width: 100%;
    outline: none;
    border: 0;
    box-shadow: none;
    .v-input__input {
      padding: 0;
    }
    .v-input__input,
    .v-input__input:focus,
    .v-input__input:hover,
    .v-input__input:active,
    .v-input:focus, 
    .v-input:active, 
    .v-input:hover, 
    .v-input--focus {
        outline: none;
        border: 0;
        box-shadow: none;
    }
    .v-input {
        padding: 0 0 0 5px;
    }
    .dropdown {
        position: absolute;
        top: 104%;
        left: 0;
        right: 0;
        bottom: auto;
        z-index: 99999;
        background: #fff;
        border: 1px solid #ececec;
        list-style: none;
        padding: 0;
        margin: 0;
        li {
            padding: 5px 10px;
            cursor: pointer;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            + li {
                border-top: 1px solid #ececec;
            }
        }
    }
}
.leaflet-map_form {
  .map-search {
    position: relative;
     .v-input {
       background: transparent;
       border: 0;
       border-bottom: 1px solid #eee;
       color: #fff;
      .v-input__input {
        color: #fff;
      }
    }
    .dropdown li {
      color: #555;
    }
  }
}
</style>
