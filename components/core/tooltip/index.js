import { PREFIX } from '~/utils/configs';
import { setPropSize } from '~/utils/common';
import { SimplePortal } from '~/utils/simple-portal';
import tooltip from '~/mixins/tooltip';

const COMPONENT_CLASS = PREFIX + 'tooltip';

export default {
  name: COMPONENT_CLASS,

  mixins: [tooltip],

  props: {},

  methods: {
    renderTooltip(h) {
      const arrow = h('span', {
        class: `${COMPONENT_CLASS}__arrow`
      });
      const content = h(
        'div',
        {
          class: `${COMPONENT_CLASS}__content`,
          style: {
            width: setPropSize(this.width),
            maxWidth: setPropSize(this.maxWidth)
          }
        },
        [arrow, ...(this.$slots.default || this.content || [])]
      );

      return h(
        'div',
        {
          ref: 'tooltip',
          attrs: { 'data-show': this.localVisible },
          class: `${COMPONENT_CLASS}`
        },
        [content]
      );
    }
  },

  render(h) {
    const activator = this.$scopedSlots.activator
      ? this.$scopedSlots.activator({})
      : h();
    const tooltip = this.renderTooltip(h);

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
