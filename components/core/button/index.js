import { PREFIX } from '~/utils/configs';
import { THEME_VARIANT_LIST, COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'btn';
const BUTTON_VARIANT_LIST = [
  '',
  ...THEME_VARIANT_LIST,
  ...THEME_VARIANT_LIST.map(item => 'outline-' + item),
  'link'
];

const classes = props => {
  const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
    if (!size) return cls;
    cls[`${COMPONENT_CLASS}--${size}`] = props.size === size ? true : false;
    return cls;
  }, {});

  const variantClasses = BUTTON_VARIANT_LIST.reduce((cls, variant) => {
    if (!variant) return cls;
    cls[`${COMPONENT_CLASS}--${variant}`] =
      props.variant === variant ? true : false;
    return cls;
  }, {});

  const otherClasses = {
    [`${COMPONENT_CLASS}--loading`]: props.loading,
    [`${COMPONENT_CLASS}--square`]: props.square,
    [`${COMPONENT_CLASS}--rounded`]: props.rounded
  };

  return {
    ...variantClasses,
    ...sizeClasses,
    ...otherClasses
  };
};

export default {
  name: `${PREFIX}button`,

  functional: true,

  props: {
    nuxt: Boolean,
    square: Boolean,
    rounded: Boolean,
    loading: Boolean,
    tag: {
      type: String,
      default: 'button' // 'button', 'a'
    },
    size: {
      type: String,
      default: '',
      validator: value => {
        if (['', ...COMPONENT_SIZE_LIST].includes(value)) {
          return true;
        } else {
          printWarning(
            `${PREFIX}button prop 'size' must be in ${JSON.stringify(
              COMPONENT_SIZE_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    variant: {
      type: String,
      default: '',
      validator: value => {
        if (BUTTON_VARIANT_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `${PREFIX}button prop 'variant' must be in ${JSON.stringify(
              BUTTON_VARIANT_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    to: {
      type: [String, Object] // Vue-router prop. Denotes the target route of the link.
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    }
  },

  render: function(h, ctx) {
    return h(
      ctx.props.nuxt ? 'n-link' : ctx.props.tag,
      {
        props: {
          to: ctx.props.to,
          exact: ctx.props.exact
        },
        attrs: ctx.data.attrs,
        class: [
          COMPONENT_CLASS,
          classes(ctx.props),
          ctx.data.staticClass,
          ctx.data.class
        ],
        on: ctx.listeners
      },
      [
        ctx.props.loading &&
          h('v-spinner', {
            class: `${COMPONENT_CLASS}__spinner`,
            props: {
              variant: THEME_VARIANT_LIST.includes(ctx.props.variant)
                ? ctx.props.variant
                : null
            }
          }),
        ...(ctx.children || [])
      ]
    );
  }
};
