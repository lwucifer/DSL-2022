// import { createPopper } from '@popperjs/core';
import { throttle } from 'lodash';
import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { offset } from '~/utils/dom';

const COMPONENT_CLASS = PREFIX + 'slider';

const checkTouchEvent = event => event instanceof TouchEvent;

export default {
  name: COMPONENT_CLASS,

  model: {
    event: 'input',
    prop: 'value'
  },

  props: {
    value: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: COMPONENT_SIZE_LIST[0],
      validator: value => {
        if (COMPONENT_SIZE_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'size' must be in ${JSON.stringify(
              COMPONENT_SIZE_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    disabled: Boolean
  },

  data() {
    const value = this.value || 0;

    return {
      localValue: value,
      dragging: false,
      valuePercent: value > this.min ? (value / this.max) * 100 : 0
    };
  },

  computed: {
    classes() {
      const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
        cls[`${COMPONENT_CLASS}--${size}`] = this.size === size ? true : false;
        return cls;
      }, {});

      return {
        ...sizeClasses,
        [`${COMPONENT_CLASS}--disabled`]: this.disabled
      };
    }
  },

  mounted() {
    const startEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    const moveEvent = 'ontouchmove' in window ? 'touchmove' : 'mousemove';
    const cancelEvent = 'ontouchend' in window ? 'touchend' : 'mouseup';
    this.$refs.slider.addEventListener(startEvent, this.handleMouseDownSlider);
    window.addEventListener(moveEvent, this.handleMouseMove);
    window.addEventListener(cancelEvent, this.handleMouseUp);
  },

  beforeDestroy() {
    const startEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
    const moveEvent = 'ontouchmove' in window ? 'touchmove' : 'mousemove';
    const cancelEvent = 'ontouchend' in window ? 'touchend' : 'mouseup';
    this.$refs.slider.removeEventListener(startEvent, this.handleMouseDownSlider);
    window.removeEventListener(moveEvent, this.handleMouseMove);
    window.removeEventListener(cancelEvent, this.handleMouseUp);
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
    setValue(mouseClientX) {
      const { min, max, step } = this;
      const { rail } = this.$refs;
      const steps = (max - min) / step;
      const percentPerStep = 100 / steps;
      const railOffsetLeft = offset(rail).left;
      let left = mouseClientX - railOffsetLeft;
      if (left < 0) {
        left = 0;
      } else if (left > rail.offsetWidth) {
        left = rail.offsetWidth;
      }

      const percent = (left / rail.offsetWidth) * 100;
      this.valuePercent = percentPerStep * Math.round(percent / percentPerStep);
      this.localValue = min + Math.round(percent / percentPerStep) * step;
    },

    handleMouseDownSlider(event) {
      const clientX = checkTouchEvent(event) ? event.touches[0].clientX : event.clientX;
      this.dragging = true;
      this.setValue(clientX);
    },

    handleMouseMove: throttle(function(event) {
      if (this.dragging) {
        const clientX = checkTouchEvent(event) ? event.touches[0].clientX : event.clientX; 
        this.setValue(clientX);
      }
    }, 16),

    handleMouseUp() {
      this.dragging = false;
    }
  },

  render(h) {
    const rail = h('div', {
      ref: 'rail',
      class: `${COMPONENT_CLASS}__rail`
    });
    const track = h('div', {
      class: `${COMPONENT_CLASS}__track`,
      style: {
        width: this.valuePercent + '%'
      }
    });
    const thumb = h('div', {
      ref: 'thumb',
      attrs: {
        tabindex: '0',
        'aria-valuenow': this.localValue,
        'aria-valuemin': this.min,
        'aria-valuemax': this.max
      },
      class: `${COMPONENT_CLASS}__thumb`,
      style: {
        left: this.valuePercent + '%'
      }
    });
    // const step; // for render steps

    return h(
      'div',
      {
        ref: 'slider',
        attrs: {
          tabindex: '-1'
        },
        class: COMPONENT_CLASS,
      },
      [rail, track, thumb]
    );
  }
};
