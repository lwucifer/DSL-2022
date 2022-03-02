import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'tab-panel';

export default {
  props: {
    title: String
  },

  data() {
    return {
      isActive: false
    };
  },

  render(h) {
    return h(
      'div',
      {
        attrs: {
          role: 'tabpanel'
        },
        staticClass: COMPONENT_CLASS,
        class: { active: this.isActive }
      },
      [this.$slots.default]
    );
  }
};
