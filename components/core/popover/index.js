import { createPopper } from '@popperjs/core';
import { PREFIX } from '~/utils/configs';
import { printWarning } from '~/utils/handle-error';
import { setPropSize } from '~/utils/common';
import { SimplePortal } from '~/utils/simple-portal';
import tooltip from '~/mixins/tooltip';

const COMPONENT_CLASS = PREFIX + 'popover';

export default {
  name: COMPONENT_CLASS,

  mixins: [tooltip],

  props: {
    trigger: {
      default: 'click'
    },
    popover: {
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },

  methods: {
    renderPopover(h) {
      const arrow = h('span', {
        class: `${COMPONENT_CLASS}__arrow`
      });
      const header = this.title
        ? h(
            'div',
            {
              class: `${COMPONENT_CLASS}__header`
            },
            this.title
          )
        : null;

      const body = h(
        'div',
        {
          class: `${COMPONENT_CLASS}__body`
        },
        [...(this.$slots.default || this.content || [])]
      );

      const content = h(
        'div',
        {
          class: `${COMPONENT_CLASS}__content`,
          style: {
            width: setPropSize(this.width),
            maxWidth: setPropSize(this.maxWidth)
          }
        },
        [arrow, header, body]
      );

      return h(
        'div',
        {
          ref: 'tooltip',
          attrs: { 'data-show': this.localVisible },
          class: COMPONENT_CLASS
        },
        [content]
      );
    }
  },

  render(h) {
    const activator = this.$scopedSlots.activator({});
    const tooltip = this.renderPopover(h);

    return h(
      'span',
      {
        ref: 'trigger',
        directives: [{ name: 'clickOutside', expression: '$_tooltip_hide' }],
        class: `${COMPONENT_CLASS}-trigger`,
        on: this.eventTrigger
      },
      [activator, this.isHidden ? h() : h(SimplePortal, [tooltip])]
    );
  }
};
