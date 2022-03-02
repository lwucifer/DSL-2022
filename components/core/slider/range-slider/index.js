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
      type: Array,
      default: () => [0, 0]
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
      validator: (value) => {
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
    const [start = 0, end = 0] = this.value;
    const newStart =
      start <= this.min ? this.min : start >= this.max ? this.max : start;
    const newEnd =
      end <= this.min ? this.min : end >= this.max ? this.max : end;
    const localValue = [newStart, newEnd];

    return {
      localValue,
      dragging: false,
      draggingThumb: null, // null | 'start' | 'end'
      valuePercent: localValue.map((value) =>
        value > this.min ? (value / this.max) * 100 : 0
      )
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
      this.valuePercent = newValue.map((value) =>
        value > this.min ? (value / this.max) * 100 : 0
      );
      this.$emit('input', newValue);
    },

    draggingThumb(newValue) {
      if (newValue === 'start') {
        this.$refs.thumbStart && this.$refs.thumbStart.focus();
      }
      if (newValue === 'end') {
        this.$refs.thumbEnd && this.$refs.thumbEnd.focus();
      }
    }
  },

  methods: {
    calcPercent(mouseClientX) {
      const { rail } = this.$refs;
      const railOffsetLeft = offset(rail).left;
      let left = mouseClientX - railOffsetLeft;
      if (left < 0) {
        left = 0;
      } else if (left > rail.offsetWidth) {
        left = rail.offsetWidth;
      }
      return (left / rail.offsetWidth) * 100;
    },

    setValue(percent) {
      const { min, max, step } = this;
      const steps = (max - min) / step;
      const percentPerStep = 100 / steps;
      const tmpLocalValue = min + Math.round(percent / percentPerStep) * step;
      // Check will change thumb
      if (this.draggingThumb === 'start') {
        if (tmpLocalValue >= this.localValue[1]) {
          this.draggingThumb = 'end';
          this.$nextTick(() => {
            this.localValue = [this.localValue[1], tmpLocalValue];
            return;
          });
        }
        this.localValue = [tmpLocalValue, this.localValue[1]];
      } else {
        if (tmpLocalValue <= this.localValue[0]) {
          this.draggingThumb = 'start';
          this.$nextTick(() => {
            this.localValue = [tmpLocalValue, this.localValue[0]];
            return;
          });
        }
        this.localValue = [this.localValue[0], tmpLocalValue];
      }
    },

    handleMouseDownSlider(event) {
      const clientX = checkTouchEvent(event) ? event.touches[0].clientX : event.clientX;
      const percent = this.calcPercent(clientX);

      this.draggingThumb =
        Math.abs(percent - this.valuePercent[0]) <
        Math.abs(percent - this.valuePercent[1])
          ? 'start'
          : 'end';
      this.dragging = true;

      this.$nextTick(() => {
        this.setValue(percent);
      });
    },

    handleMouseMove: throttle(function (event) {
      if (this.dragging) {
        const clientX = checkTouchEvent(event) ? event.touches[0].clientX : event.clientX; 
        const percent = this.calcPercent(clientX);
        this.setValue(percent);
      }
    }, 16),

    handleMouseUp() {
      this.dragging = false;
      this.draggingThumb = null;
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
        left: this.valuePercent[0] + '%',
        width: this.valuePercent[1] - this.valuePercent[0] + '%'
      }
    });
    const thumbStart = h('div', {
      ref: 'thumbStart',
      attrs: {
        tabindex: '0',
        'aria-valuenow': this.localValue[0],
        'aria-valuemin': this.min,
        'aria-valuemax': this.max
      },
      class: `${COMPONENT_CLASS}__thumb`,
      style: {
        left: this.valuePercent[0] + '%'
      }
    });
    const thumbEnd = h('div', {
      ref: 'thumbEnd',
      attrs: {
        tabindex: '0',
        'aria-valuenow': this.localValue[1],
        'aria-valuemin': this.min,
        'aria-valuemax': this.max
      },
      class: `${COMPONENT_CLASS}__thumb`,
      style: {
        left: this.valuePercent[1] + '%'
      }
    });

    return h(
      'div',
      {
        ref: 'slider',
        attrs: {
          tabindex: '-1'
        },
        class: COMPONENT_CLASS
      },
      [rail, track, thumbStart, thumbEnd]
    );
  }
};
