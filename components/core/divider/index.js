import { PREFIX } from '~/utils/configs';
import { THEME_VARIANT_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'divider';
const DIDIVER_VARIANT_LIST = [
  '',
  ...THEME_VARIANT_LIST
];

const classes = (props) => {
  const variantClasses = DIDIVER_VARIANT_LIST.reduce((cls, variant) => {
    cls[`${COMPONENT_CLASS}--${variant}`] =
      props.variant === variant ? true : false;
    return cls;
  }, {});

  return {
    [`${COMPONENT_CLASS}--horizontal`]: props.type == 'horizontal',
    [`${COMPONENT_CLASS}--vertical`]: props.type == 'vertical',
    ...variantClasses,
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
    variant: {
      type: String,
      default: '',
      validator: (value) => {
        if (DIDIVER_VARIANT_LIST.includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'variant' must be in ${JSON.stringify(
              DIDIVER_VARIANT_LIST
            )}, current: '${value}'`
          );
          return false;
        }
      }
    },
    type: {
      type: String,
      default: 'horizontal',
      validator: (value) => ['horizontal', 'verical'].includes(value)
    }
  },

  render(h, ctx) {
    return h(ctx.props.tag, {
      class: [
        COMPONENT_CLASS,
        classes(ctx.props),
        ctx.data.staticClass,
        ctx.data.class
      ]
    });
  }
};
