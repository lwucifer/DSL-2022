import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'tabs';

export default {
  model: {
    prop: 'active',
    event: 'change'
  },

  props: {
    active: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      localActive: this.active,
      tabs: []
    };
  },

  created() {
    this.updateTabs();
  },

  updated() {
    this.updateTabs();
  },

  watch: {
    active(newValue) {
      this.localActive = newValue;
    },

    localActive(newValue) {
      this.$emit('change', newValue);
    }
  },

  methods: {
    changeTab(event, key) {
      event && event.preventDefault();
      this.localActive = key;

      this.tabs.forEach(item => {
        item.isActive = item.$tabKey === key;
      });
    },

    updateTabs() {
      this.$children.forEach((item, index) => {
        item.$tabKey = item.$vnode.key != undefined ? item.$vnode.key : index;
        item.isActive = item.$tabKey === this.localActive
      });

      this.tabs = this.$children;
    }
  },

  render(h) {
    const tabList = h(
      'div',
      {
        attrs: {
         role: 'tablist' 
        },
        staticClass: `${COMPONENT_CLASS}__tab-list`
      },
      this.tabs.map(tab =>
        h(
          'a',
          {
            attrs: {
              href: '',
              'data-toggle': 'tab',
              role: 'tab',
              'aria-selected': tab.isActive ? 'true' : 'false'
            },
            staticClass: `${COMPONENT_CLASS}__tab-item`,
            class: { active: tab.isActive },
            on: {
              click: event => this.changeTab(event, tab.$tabKey)
            }
          },
          tab.title
        )
      )
    );

    return h(
      'div',
      {
        staticClass: COMPONENT_CLASS
      },
      [tabList, this.$slots.default]
    );
  }
};
