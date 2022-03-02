import { PREFIX } from '~/utils/configs';
import { COMPONENT_SIZE_LIST } from '~/utils/constants';
import { printWarning } from '~/utils/handle-error';
import { setPropSize } from '~/utils/common';

const COMPONENT_CLASS = PREFIX + 'avatar';
const DEFAULT_SIZE = COMPONENT_SIZE_LIST[0];

const classes = (props) => {
  const sizeClasses = COMPONENT_SIZE_LIST.reduce((cls, size) => {
    if (size === DEFAULT_SIZE) return cls;
    cls[`${COMPONENT_CLASS}--${size}`] = props.size === size ? true : false;
    return cls;
  }, {});

  return {
    [`${COMPONENT_CLASS}--square`]: props.shape === 'square',
    ...sizeClasses
  };
};

export default {
  name: COMPONENT_CLASS,

  functional: true,

  props: {
    tag: {
      type: String,
      default: 'span'
    },
    nuxt: Boolean,
    to: {
      type: [String, Object], // Vue-router prop. Denotes the target route of the link.
      default: ''
    },
    exact: {
      type: Boolean // Vue-router prop. Exactly match the link. Without this, '/' will match every route.
    },
    shape: {
      type: String,
      default: 'circle', // circle | square,
      validator: (value) => {
        if (['square', 'circle'].includes(value)) {
          return true;
        } else {
          printWarning(
            `${COMPONENT_CLASS} prop 'shape' must be in ['square', 'circle'], current: '${value}'`
          );
          return false;
        }
      }
    },
    size: {
      type: [String, Number],
      default: DEFAULT_SIZE, // default | xs | sm | lg | css value
      // validator: (value) => {
      //   if (COMPONENT_SIZE_LIST.includes(value) || typeof value === 'number') {
      //     return true;
      //   } else {
      //     printWarning(
      //       `${COMPONENT_CLASS} prop 'size' must be in ${JSON.stringify(
      //         COMPONENT_SIZE_LIST
      //       )} or a number value, current: '${value}'`
      //     );
      //     return false;
      //   }
      // }
    },
    src: {
      type: String,
      default: ''
    },
    srcSet: {
      type: String,
      default: ''
    },
    loadError: {
      type: Function,
      default: () => {}
    }
  },

  render(h, ctx) {
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
        style: {
          width: setPropSize(ctx.props.size),
          height: setPropSize(ctx.props.size)
        },
        on: ctx.$listeners
      },
      [
        h('img', {
          attrs: {
            src: ctx.props.src,
            srcset: ctx.props.srcSet,
            alt: ctx.props.alt
          },
          on: {
            error: ctx.props.loadError
          }
        })
      ]
    );
  }
};
