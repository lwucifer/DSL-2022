<script>
export default {
  props: {
    tag: String,
    tabs: {
      type: Array,
      default: () => [],
      validator: (value) =>
        value.every((item) => ['title', 'attrs'].every((key) => key in item))
    },
    active: String
  },

  data() {
    return {
      show: true,
      stickyOffsetTop: 48,
    }
  },

  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },

  watch: {
    stickyOffsetTop: {
      immediate: true,
      handler(newValue) {
        this.show = false;
        this.$nextTick(() => {
          this.show = true;
        })
      }
    }
  },

  methods: {
    handleClickTab(event, tab) {
      this.$emit('click-tab', event, tab);
    },
    
    handleWindowResize() {
      if (window.innerWidth >= 1440) {
        this.stickyOffsetTop = 80;
      } else if (window.innerWidth >= 1248) {
        this.stickyOffsetTop = 64;
      } else {
        this.stickyOffsetTop = 48;
      }
    }
  },

  render(h) {
    return this.show ? h(
      this.tag || 'div',
      {
        staticClass: 'tab-nav',
        directives: [
          {
            name: 'sticky'
          }
        ],
        attrs: {
          'sticky-offset': `{ top: ${this.stickyOffsetTop} }`
        },
        style: {
          top: this.stickyOffsetTop + 'px'
        }
      },
      [
        h('nav', { staticClass: 'tab-nav__content' }, [
          this.tabs.map((tab) =>
            h(
              tab.tag || 'a',
              {
                attrs: {
                  href: tab.attrs ? tab.attrs.href : '',
                  ...(tab.attrs || {})
                },
                staticClass: 'tab-nav__item',
                on: {
                  click: (event) => this.handleClickTab(event, tab)
                }
              },
              tab.title
            )
          )
        ])
      ]
    ) : h();
  }
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/components/pages/common/_tab-nav.scss';
</style>