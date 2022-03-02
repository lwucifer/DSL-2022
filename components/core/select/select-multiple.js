import { SimplePortal } from '~/utils/simple-portal';
import { PREFIX } from '~/utils/configs';

const renderPrepend = (h, vm) =>
  h(
    'span',
    {
      class: `${vm.COMPONENT_CLASS}__prepend`
    },
    [
      vm.$slots.prepend
        ? vm.$slots.prepend
        : vm.$scopedSlots.prepend
        ? vm.$scopedSlots.prepend({
            selected: vm.selected
          })
        : vm.prepend
    ]
  );

const renderAppend = (h, vm) =>
  h(
    'span',
    {
      class: `${vm.COMPONENT_CLASS}__append`
    },
    [
      vm.$slots.append
        ? vm.$slots.append
        : vm.$scopedSlots.append
        ? vm.$scopedSlots.append({
            selected: vm.selected
          })
        : vm.append
    ]
  );

const renderPlaceholder = (h, vm) =>
  h(
    'span',
    {
      directives: [{ name: 'show', value: !vm.localValue.length }],
      class: `${vm.COMPONENT_CLASS}__placeholder`
    },
    [vm.$attrs.placeholder || '']
  );

const renderInputField = (h, vm) =>
  h(
    'div',
    {
      class: `${vm.COMPONENT_CLASS}__field`
    },
    [
      h('input', {
        ref: 'search',
        attrs: {
          type: 'text',
          autocomplete: 'off'
        },
        class: `${vm.COMPONENT_CLASS}__field-input`,
        domProps: {
          value: vm.search
        },
        on: {
          input: vm.handleSearchTag,
          keyup: vm.handleKeyupSearchTag
        }
      }),
      h(
        'span',
        { ref: 'fieldSize', class: `${vm.COMPONENT_CLASS}__field-size` },
        vm.search + '&nbsp;'
      )
    ]
  );

const renderClear = (h, vm) =>
  h(
    'span',
    {
      class: `${vm.COMPONENT_CLASS}__clear`,
      on: {
        click: function (event) {
          event.stopPropagation();
          vm.handleClickClear();
        }
      }
    },
    'icon clear'
  );

const renderArrow = (h, vm) =>
  h(
    'span',
    {
      class: `${vm.COMPONENT_CLASS}__arrow`
    },
    [vm.$slots['placeholder-icon'] || h('span')]
  );

const renderSelected = (h, vm) => {
  const prepend =
    vm.$slots.prepend || vm.$scopedSlots.prepend ? renderPrepend(h, vm) : null;
  const append =
    vm.$slots.append || vm.$scopedSlots.append ? renderAppend(h, vm) : null;
  const inputField = renderInputField(h, vm);
  const defaultSelectedValues = vm.selected.length
    ? vm.selected.map((option, index) => {
        return h(
          `${PREFIX}tag`,
          {
            key: option.value,
            props: {
              size: vm.size === 'sm' ? 'xs' : 'sm',
              showClose: true
            },
            on: {
              close: function (event) {
                event.stopPropagation();
                vm.handleCloseTag(option, index);
              }
            }
          },
          option.text
        );
      })
    : null;

  const selectedValues = h(
    'div',
    {
      class: `${vm.COMPONENT_CLASS}__selected-value`
    },
    [
      vm.$scopedSlots.selected
        ? vm.$scopedSlots.selected({
            selected: vm.selected
          })
        : defaultSelectedValues,
      renderPlaceholder(h, vm),
      inputField
    ]
  );
  const clearIcon = vm.showClear ? renderClear(h, vm) : null;
  const arrow = vm.showArrow ? renderArrow(h, vm) : null;
  const selectedContent = h(
    'div',
    {
      class: `${vm.COMPONENT_CLASS}__selected-content`
    },
    [prepend, selectedValues, clearIcon]
  );

  return h(
    'div',
    {
      ref: 'selected',
      class: `${vm.COMPONENT_CLASS}__selected`,
      attrs: {
        tabindex: '0'
      },
      on: {
        click: vm.handleClickSelected
      }
    },
    [selectedContent, append, arrow]
  );
};

const renderOptionItems = (h, vm) => {
  if (vm.tmpOptions.length) {
    return vm.tmpOptions.map((option) => {
      const optionContent = vm.$slots.option
        ? vm.$slots.option
        : vm.$scopedSlots.option
        ? vm.$scopedSlots.option({
            option
          })
        : option.text;

      return h(
        'div',
        {
          key: option.value,
          attrs: {
            tabIndex: 0,
            size: vm.size
          },
          class: {
            [`${vm.COMPONENT_CLASS}__option`]: true,
            active: vm.localValue.includes(option.value)
          },
          on: {
            click: () => vm.handleClickOption(option)
          }
        },
        [optionContent]
      );
    });
  } else {
    return [
      h(
        'div',
        {
          class: `${vm.COMPONENT_CLASS}__option ${vm.COMPONENT_CLASS}__option--empty`
        },
        vm.emptyMessage
      )
    ];
  }
};

const renderOptions = (h, vm) => {
  const options = h(
    'div',
    {
      ref: 'options',
      attrs: { hidden: !vm.localActive },
      staticClass: `${vm.COMPONENT_CLASS}__options-wrapper`,
      class: vm.optionsWrapperClass,
      style: {
        width: vm.optionsWidth + 'px'
      }
    },
    [
      h(
        'div',
        {
          class: `${vm.COMPONENT_CLASS}__options`
        },
        [...renderOptionItems(h, vm), vm.$slots['options-append']]
      )
    ]
  );

  return vm.appendOptionsToBody ? h(SimplePortal, {}, [options]) : options;
};

export default function (h, vm) {
  return [renderSelected(h, vm), vm.isHidden ? h() : renderOptions(h, vm)];
}
