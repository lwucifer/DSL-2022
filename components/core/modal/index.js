import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { setPropSize, isBrowser } from '~/utils/common';
import { SimplePortal } from '~/utils/simple-portal';

const COMPONENT_CLASS = PREFIX + 'modal';

const btnClose = (h, vm) =>
  h('button', {
    class: `${COMPONENT_CLASS}-close`,
    attrs: { 'data-dismiss': 'modal', 'aria-label': 'Close' },
    on: { click: vm.cancel }
  });

const makeHeader = (h, vm) => {
  return h(
    'div',
    {
      staticClass: `${COMPONENT_CLASS}-header`,
      class: vm.headerClass
    },
    [
      vm.$scopedSlots.header
        ? vm.$scopedSlots.header({
            cancel: vm.cancel
          })
        : h(
            'div',
            {
              class: 'd-flex align-items-center justify-content-between'
            },
            [
              h('h5', { class: `${COMPONENT_CLASS}-title` }, vm.title),
              btnClose(h, vm)
            ]
          )
    ]
  );
};

const makeBody = (h, vm) => {
  return h(
    'div',
    {
      staticClass: `${COMPONENT_CLASS}-body`,
      class: vm.bodyClass
    },
    [!vm.header && btnClose(h, vm), vm.$slots.default]
  );
};

const makeFooter = (h, vm) => {
  return h(
    'div',
    {
      staticClass: `${COMPONENT_CLASS}-footer`,
      class: vm.footerClass
    },
    [
      vm.$scopedSlots.footer
        ? vm.$scopedSlots.footer
        : h(
            'div',
            {
              class: 'd-flex justify-content-end'
            },
            [
              h(
                'v-button',
                {
                  staticClass: `${COMPONENT_CLASS}-btn-cancel`,
                  props: {
                    loading: vm.cancelLoading,
                    rounded: true,
                    size: vm.size,
                    ...vm.btnCancelProps
                  },
                  on: {
                    click: vm.cancel
                  }
                },
                [vm.$slots.cancelText ? vm.$slots.cancelText : vm.$t(vm.cancelText)]
              ),
              h(
                'v-button',
                {
                  props: {
                    variant: 'primary',
                    loading: vm.confirmLoading,
                    rounded: true,
                    size: vm.size,
                    ...vm.btnOkProps
                  },
                  on: {
                    click: vm.ok
                  }
                },
                [vm.$slots.okText ? vm.$slots.okText : vm.$t(vm.okText)]
              )
            ]
          )
    ]
  );
};

export default {
  name: COMPONENT_CLASS,

  inheritAttrs: false,

  model: {
    prop: 'visible',
    event: 'visibleChange'
  },

  props: {
    static: Boolean,
    width: {
      type: [Number, String]
    },
    maxWidth: {
      type: [Number, String]
    },
    size: {
      type: [String, Number],
      default: '', // '' | 'sm' | 'lg' | 'md' | css value
      validator: (value) => {
        if (
          [...COMPONENT_SIZE_LIST, 'xl', ''].includes(value) ||
          typeof value === 'number'
        ) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'size' must be in ${JSON.stringify([
              ...COMPONENT_SIZE_LIST,
              'xl'
            ])} or a number value, current: '${value}'`
          );
          return false;
        }
      }
    },
    centered: Boolean,
    visible: Boolean, // v-model
    title: String,
    confirmLoading: Boolean,
    cancelLoading: Boolean,
    footer: {
      type: Boolean,
      default: true
    },
    header: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: 'core.back'
    },
    okText: {
      type: String,
      default: 'core.confirm'
    },
    noBackdrop: Boolean,
    transition: {
      type: [String, Boolean],
      default: 'fade' // 'fade', 'scale', false, true = 'fade'
    },
    modalClass: {
      type: [Object, String, Array],
      default: ''
    },
    headerClass: {
      type: [Object, String, Array],
      default: ''
    },
    bodyClass: {
      type: [Object, String, Array],
      default: ''
    },
    footerClass: {
      type: [Object, String, Array],
      default: ''
    },
    btnCancelProps: {
      type: Object,
      default: () => ({})
    },
    btnOkProps: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      isHidden: this.static ? false : !this.visible, // If modal should not be in document
      localVisible: false, // If modal in document and visible, trigger trainsition to show modal
      isTransitioning: false // If modal is transitioning
    };
  },

  created() {
    if (isBrowser) {
      window.addEventListener('keyup', this.handleKeyUpEscape);
    }

    this.visible && this.show();
  },

  beforeDestroy() {
    if (isBrowser) {
      window.removeEventListener('keyup', this.handleKeyUpEscape);
    }
  },

  watch: {
    visible(newValue) {
      this[newValue ? 'show' : 'hide']();
    },

    localVisible(newValue) {
      this.$emit('visibleChange', newValue);
    }
  },

  methods: {
    ok() {
      this.$emit('ok');
    },

    cancel() {
      this.$emit('cancel');
    },

    handleKeyUpEscape(event) {
      if (event.key === 'Esc' || event.key === 'Escape') {
        this.cancel();
      }
    },

    show() {
      // If modal is already showed, do nothing
      if (this.localVisible) return;

      if (this.isHidden) {
        this.isHidden = false;
      }

      this.$nextTick(() => {
        const timeout = setTimeout(() => {
          this.localVisible = true;
          clearTimeout(timeout);
        }, 100);
      });
    },

    hide() {
      if (this.localVisible) {
        this.localVisible = false;
      }
    },

    makeModal(h) {
      const backDrop = this.noBackdrop
        ? null
        : h('div', {
            class: `${COMPONENT_CLASS}-backdrop`,
            on: { click: this.cancel }
          });

      const modalHeader = this.header ? makeHeader(h, this) : null;
      const modalBody = makeBody(h, this);
      const modalFooter = this.footer ? makeFooter(h, this) : null;

      const modalDialog = h(
        'div',
        {
          class: [
            `${COMPONENT_CLASS}-dialog`,
            {
              [`${COMPONENT_CLASS}-sm`]: this.size === 'sm',
              [`${COMPONENT_CLASS}-md`]: this.size === 'md',
              [`${COMPONENT_CLASS}-lg`]: this.size === 'lg',
              [`${COMPONENT_CLASS}-xl`]: this.size === 'xl'
            }
          ],
          attrs: {
            tabIndex: -1,
            role: 'dialog',
            ...this.$attrs
          },
          style: {
            width: setPropSize(this.width),
            maxWidth: setPropSize(this.maxWidth)
          }
        },
        [
          h(
            'div',
            {
              class: `${COMPONENT_CLASS}-content`,
              attrs: {
                role: 'document'
              }
            },
            [modalHeader, modalBody, modalFooter]
          )
        ]
      );

      return h(
        'div',
        {
          class: [
            `${COMPONENT_CLASS}`,
            this.modalClass,
            {
              show: this.localVisible,
              fade: this.transition === 'fade',
              scale: this.transition === 'scale',
              [`${COMPONENT_CLASS}-centered`]: this.centered
            }
          ]
        },
        [backDrop, modalDialog]
      );
    }
  },

  render(h) {
    if (this.static) {
      return this.makeModal(h);
    } else {
      return this.isHidden ? h() : h(SimplePortal, [this.makeModal(h)]);
    }
  }
};
