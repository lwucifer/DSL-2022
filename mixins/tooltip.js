import { createPopper } from '@popperjs/core';
import { PREFIX } from '~/utils/configs';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'tooltip';

export default {
  name: COMPONENT_CLASS,

  directives: {
    clickOutside: {
      bind: function(el, binding, vnode) {
        vnode.context.$_tooltip_handleClickOutSide = event => {
          // Apply only for trigger === 'click'
          if (vnode.context.trigger === 'click') {
            const { tooltip } = vnode.context.$refs;
            const { target } = event;
            if (!vnode.context.localVisible || !tooltip) return;

            const isTargetEl = target === el || el.contains(target);
            const isTargetTooltip = tooltip.contains(target);
            if (!isTargetEl && !isTargetTooltip) {
              vnode.context[binding.expression]();
            }
          }
        };
        window.addEventListener('click', vnode.context.$_tooltip_handleClickOutSide);
      },

      unbind: function(el, binding, vnode) {
        window.removeEventListener('click', vnode.context.$_tooltip_handleClickOutSide);
      }
    }
  },

  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    tag: {
      type: String,
      default: 'span'
    },
    visible: Boolean, // v-model
    delay: {
      type: Number,
      default: 0
    },
    width: {
      type: [Number, String]
    },
    maxWidth: {
      type: [Number, String]
    },
    content: String,
    trigger: {
      type: String,
      default: 'hover',
      validator: value => ['hover', 'click'].includes(value)
    },
    placement: {
      type: String,
      default: 'auto',
      validator: value =>
        [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end'
        ].includes(value) // placement of popper lib
    },
    popover: Boolean
  },

  data() {
    return {
      popperInstance: null,
      isHidden: !this.visible, // If tooltip should not be in document
      localVisible: this.visible // If tooltip in document and visible, trigger trainsition to show tooltip
      //isTransitioning: false // If tooltip is transitioning,
    };
  },

  computed: {
    eventTrigger() {
      let on = {};

      if (this.trigger === 'hover') {
        on = {
          mouseenter: this.$_tooltip_show,
          mouseleave: this.$_tooltip_hide
        };
      }

      if (this.trigger === 'click') {
        on = {
          click: this.$_tooltip_toggleShow
        };
      }

      return on;
    }
  },

  created() {
    this.$_timeout = null;
  },

  mounted() {
    this.$nextTick(() => {
      if (this.localVisible) {
        this.$_tooltip_createPopper();
        this.$_tooltip_show();
      }
    });
  },

  beforeDestroy() {
    this.$_tooltip_destroyPopper();
  },

  watch: {
    visible(newValue) {
      this[newValue ? '$_tooltip_show' : '$_tooltip_hide']();
    },

    localVisible(newValue) {
      if (newValue) {
        // tooltip content can't render immediately
        // then we must set a timeout for this
        const timeout = setTimeout(() => {
          this.$_tooltip_createPopper();
          clearTimeout(timeout)
        }, 0)
      } else {
        this.$_tooltip_destroyPopper();
      }
      this.$emit('visibleChange', newValue);
    }
  },

  methods: {
    $_tooltip_createPopper() {
      const { trigger, tooltip } = this.$refs;
      this.popperInstance = createPopper(trigger, tooltip, {
        placement: this.placement
      });
    },

    $_tooltip_destroyPopper() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }
    },

    $_tooltip_show() {
      // Check first render
      if (this.isHidden) {
        this.isHidden = false;
      }

      this.$nextTick(() => {
        const timeout = setTimeout(() => {
          // If tooltip is already showed, do nothing
          if (this.localVisible) return;

          if (this.delay) {
            this.$_timeout = setTimeout(() => {
              this.localVisible = true;
              clearTimeout(this._timeout);
            }, this.delay);
          } else {
            this.localVisible = true;
          }

          clearTimeout(timeout);
        }, 0);
      });
    },

    $_tooltip_hide(event) {
      // removetimeout when delay is set
      if (this.delay && this.$_timeout) {
        clearTimeout(this.$_timeout);
      }

      // If tooltip is already hidden, do nothing
      if (!this.localVisible) return;

      const { tooltip } = this.$refs;
      // handle mouseleave when trigger === 'hover'
      if (event && this.trigger === 'hover') {
        const { toElement } = event;
        // Prevent hide tooltip when mouseleave to tooltip element
        if (toElement === tooltip) {
          tooltip.addEventListener('mouseleave', this.$_tooltip_hide);
          return;
        }
      }

      tooltip && tooltip.removeEventListener('mouseleave', this.$_tooltip_hide);
      this.localVisible = false;
    },

    $_tooltip_toggleShow() {
      this.localVisible ? this.$_tooltip_hide() : this.$_tooltip_show();
    },
  }
};
