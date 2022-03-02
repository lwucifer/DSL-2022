import { PREFIX } from '~/utils/configs';
import { THEME_VARIANT_LIST, COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'spinner';

const classes = props => {
  const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
    cls[`${COMPONENT_CLASS}--${size}`] = props.size === size ? true : false;
    return cls;
  }, {});

  const variantClasses = THEME_VARIANT_LIST.reduce((cls, variant) => {
    cls[`${COMPONENT_CLASS}--${variant}`] =
      props.variant === variant ? true : false;
    return cls;
  }, {});

  return {
    ...variantClasses,
    ...sizeClasses
  };
};

export default {
  name: COMPONENT_CLASS,

  functional: true,

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    text: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => {
        if (THEME_VARIANT_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'variant' must be in ${JSON.stringify(
              THEME_VARIANT_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    size: {
      type: [String, Number],
      default: 'md',
      validator: value => {
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
    }
  },

  render(h, ctx) {
    const circle = () => h('span', { class: `${COMPONENT_CLASS}__spin` });
    const slotText = () =>
      ctx.slots().title ||
      (ctx.props.text &&
        h('span', { class: 'app-spin__text' }, ctx.props.text));

    return h(
      'div',
      {
        class: [
          COMPONENT_CLASS,
          classes(ctx.props),
          ctx.data.staticClass,
          ctx.data.class
        ]
      },
      [circle(), slotText()]
    );
  }
};
