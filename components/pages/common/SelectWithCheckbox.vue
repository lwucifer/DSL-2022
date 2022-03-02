<template>
  <v-select
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    v-model="localValue"
    class="select-with-checkbox"
    :showArrow="false"
  >
    <template slot="append">
      <slot name="append" v-if="hasSlot('append')"> </slot>
      <IconArrow v-else height="18" width="18" />
    </template>

    <template
      v-if="['multiple', 'default'].includes(mode)"
      slot="selected"
      slot-scope="{ selected }"
    >
      {{ setSelected(selected) }}
    </template>

    <div slot="option" slot-scope="{ option }" class="select-with-checkbox-opt">
      <v-checkbox :value="option.value" :checked="setChecked(option.value)">
        <template v-if="isRating">
          <app-star-rating
            v-model="option.value"
            :maxRating="option.value"
            :starSize="15.5"
            :increment="1"
            :border-width="4"
            border-color="#fff"
            :rounded-corners="true"
            readOnly
            class="d-inline-block"
            ltr
            :showRating="false"
            :star-points="[
              23,
              2,
              14,
              17,
              0,
              19,
              10,
              34,
              7,
              50,
              23,
              43,
              38,
              50,
              36,
              34,
              46,
              19,
              31,
              17
            ]"
          >
          </app-star-rating>
        </template>

        <template v-else>
          <span>
            {{ option.text }}
          </span>
        </template>
      </v-checkbox>
    </div>
  </v-select>
</template>

<script>
import { selectProps } from '~/components/core/select/index';
import IconArrow from '~/assets/icons/angle-down.svg?inline';
import AppStarRating from '~/components/app/AppStarRating';
import { includes } from 'lodash';

export default {
  components: {
    IconArrow,
    AppStarRating
  },

  model: {
    event: 'input',
    prop: 'value'
  },

  props: selectProps,

  data() {
    let defaultLocalValue = this.value;
    if (this.value == null) {
      defaultLocalValue = ['tag', 'multiple'].includes(this.mode) ? [] : null;
    }

    return {
      localValue: defaultLocalValue
    };
  },

  watch: {
    value(newValue) {
      this.localValue = newValue;
    },

    localValue(newValue) {
      this.$emit('input', newValue);
    }
  },

  methods: {
    setChecked(value) {
      if (['tag', 'multiple'].includes(this.mode)) {
        return this.localValue.includes(value) ? value : null;
      } else {
        // default mode
        return this.localValue === value ? value : null;
      }
    },

    hasSlot(name = 'default') {
      return this.$slots[name] || this.$scopedSlots[name];
    },

    setSelected(selected) {
      if (selected && selected.length) {
        const firstText = selected[0].text;
        const listText = selected.length > 1
          ? `${firstText}, (+${selected.length - 1})`
          : firstText;
        return this.isRating
          ? `${listText} ${this.$t('hotel.star')}`
          : listText;
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="scss">
@import '~/assets/scss/components/app/_select-with-checkbox.scss';
</style>