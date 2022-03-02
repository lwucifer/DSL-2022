import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';

const COMPONENT_CLASS = PREFIX + 'tag';

const classes = props => {
  const sizeClasses = ['xs', ...COMPONENT_SIZE_LIST].reduce((cls, size) => {
    if (!size) return cls;
    cls[`${COMPONENT_CLASS}--${size}`] = props.size === size ? true : false;
    return cls;
  }, {});

  return sizeClasses;
};

export default {
  name: COMPONENT_CLASS,

  functional: true,

  props: {
    tag: {
      type: String,
      default: 'span'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: COMPONENT_SIZE_LIST[0],
      validator: value => {
        if (['xs', ...COMPONENT_SIZE_LIST].includes(value)) {
          return true;
        } else {
          printWarning(
            `${PREFIX}button prop 'size' must be in ${JSON.stringify([
              'xs',
              ...COMPONENT_SIZE_LIST
            ])}, current: '${value}'`
          );
          return false;
        }
      }
    }
  },

  render(h, ctx) {
    return h(
      ctx.props.tag,
      {
        class: [
          COMPONENT_CLASS,
          classes(ctx.props),
          ctx.data.staticClass,
          ctx.data.class
        ]
      },
      [
        ...(ctx.children || []),
        ctx.props.showClose &&
          h(
            'span',
            {
              class: `${COMPONENT_CLASS}__close`,
              on: {
                click: event =>
                  ctx.listeners.close ? ctx.listeners.close(event) : false
              }
            },
            '×'
          )
      ]
    );
  }
};
