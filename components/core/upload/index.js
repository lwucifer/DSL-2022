import { PREFIX } from '~/utils/configs';

const COMPONENT_CLASS = PREFIX + 'upload';

export default {
  name: COMPONENT_CLASS,

  inheritAttrs: false,

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    multiple: Boolean,
    accept: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String
    },
    inputText: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: 'Chọn file'
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    disabled: Boolean
  },

  data() {
    return {
      input: true,
      localFileList: this.fileList
    };
  },

  computed: {
    uploadListeners: function () {
      const vm = this;
      // `Object.assign` merges objects together to form a new object
      return Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          change: function (event) {
            vm.localFileList = event.target.files;
            vm.$emit('change', event.target.files, event);
            vm.input = false;
            const timeout = setTimeout(() => {
              vm.input = true;
              clearTimeout(timeout);
            });
          }
        }
      );
    }
  },

  watch: {
    fileList(newValue) {
      this.localFileList = this.fileList;
    }
  },

  methods: {
    triggerClickInput() {
      this.$refs.inputFile && this.$refs.inputFile.click();
    }
  },

  render(h) {
    const input = h('input', {
      ref: 'inputFile',
      attrs: {
        ...this.$attrs,
        type: 'file',
        multiple: this.multiple,
        accept: this.accept,
        disabled: this.disabled,
        hidden: true
      },
      staticClass: `${COMPONENT_CLASS}__input`,
      on: this.uploadListeners
    });

    const defaultContent = h(
      'div',
      {
        staticClass: `${COMPONENT_CLASS}__default-slot`
      },
      [
        h('div', { staticClass: `${COMPONENT_CLASS}__control` }, [
          this.inputText &&
            h(
              'div',
              {
                staticClass: `${COMPONENT_CLASS}__text`
              },
              [
                this.localFileList.length
                  ? h(
                      'span',
                      {
                        staticClass: `${COMPONENT_CLASS}__file-name`
                      },
                      this.$scopedSlots.fileName
                        ? this.$scopedSlots.fileName({
                            fileList: this.localFileList
                          })
                        : this.localFileList[0]
                        ? this.localFileList[0].name
                        : ''
                    )
                  : h(
                      'span',
                      {
                        staticClass: `${COMPONENT_CLASS}__placeholder`
                      },
                      this.placeholder || 'No file selected'
                    )
              ]
            ),
          h(
            `${PREFIX}button`,
            {
              props: {
                variant: 'primary'
              }
            },
            [this.title]
          )
        ]),
        this.$slots.hint
      ]
    );

    const button = h(
      'span',
      {
        attrs: {
          role: 'button',
          tabindex: 0
        },
        staticClass: `${COMPONENT_CLASS}__button`,
        on: {
          click: this.triggerClickInput
        }
      },
      [
        this.input && input,
        this.$scopedSlots.default
          ? this.$scopedSlots.default({ fileList: this.localFileList })
          : defaultContent
      ]
    );

    return h(
      this.tag,
      {
        staticClass: COMPONENT_CLASS,
        class: {
          [`${COMPONENT_CLASS}--disabled`]: this.disabled
        }
      },
      [button]
    );
  }
};
