<template>
  <div class="top-bar d-none d-xl-block">
    <div class="top-bar__container container">
      <div class="top-bar__left">
        <span class="top-bar__location">
          <IconRain class="icon primary" />
          &nbsp; {{ get(weather, 'name', '...') }}
          <span class="primary">
            &nbsp; {{ get(weather, 'main.temp', '--') }}<sup>o</sup>C
          </span>
        </span>

        <span
          >{{$t("header.air_quality")}}:
          <span class="primary"
            >AQI {{ getAqi }} &nbsp;{{ $t(aqiFilter(getAqi)) }}</span
          ></span
        >
      </div>

      <div class="top-bar__right">
        <v-select
          :defaultValue="defaultCurrencyId"
          :value="defaultCurrencyId"
          size="md"
          placeholder=""
          :options="selectCurrencies"
          class="top-bar__select"
          options-wrapper-class="top-bar__options-wrapper top-bar__options-wrapper--currency"
          :popperOptions="{ placement: 'bottom-end' }"
          :append-options-to-body="false"
          @input="(val) => setUtilitiesDefaultConfigCurrency(val)"
        >
          <div
            slot="option"
            slot-scope="{ option }"
            class="top-bar__currency-option"
          >
            <span>{{ option.text }}</span>
            <span>{{ option.sign }}</span>
          </div>
        </v-select>

        <v-select
          :defaultValue="defaultLangId"
          :value="defaultLangId"
          size="md"
          placeholder=""
          :options="selectLanguages"
          class="top-bar__select"
          options-wrapper-class="top-bar__options-wrapper"
          :append-options-to-body="false"
          @input="handleChangeLang"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IconRain from '~/assets/icons/rain.svg?inline';
import * as commonActionTypes from '~/utils/action-type/common';

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { get } from 'lodash';
import { LANG_IDS } from '~/utils/configs';
import { aqiFilter } from '~/plugins/filters'

export default {
  components: {
    IconRain
  },

  computed: {
    ...mapState('common/common', [
      'weather',
      'defaultLang',
      'defaultCurrency',
      'defaultOrderBy',
      'languages'
    ]),
    ...mapGetters('common/common', [
      'getAqi',
      'selectCurrencies',
      'selectLanguages'
    ]),

    defaultCurrencyId() {
      return this.defaultCurrency.id;
    },
    defaultLangId() {
      return this.defaultLang.id;
    }
  },

  methods: {
    get,
    aqiFilter,

    ...mapMutations('common/common', [
      'setUtilitiesDefaultConfigLang',
      'setUtilitiesDefaultConfigCurrency'
    ]),
    ...mapActions("common/common", ["getMenuConfig"]),

    handleChangeLang(langId) {
      this.setUtilitiesDefaultConfigLang(langId);

      // get menu config by lang
      this.getMenuConfig();

      // set locale
      const lang = this.languages.find(l => l.id == langId);
      const langCode = get(lang, 'code', 'vi');
      this.$i18n.setLocale(langCode.toLowerCase());
    }
  },
};
</script>

<style lang="scss">
@import '~/assets/scss/components/layouts/_header-default-topbar.scss';
</style>
