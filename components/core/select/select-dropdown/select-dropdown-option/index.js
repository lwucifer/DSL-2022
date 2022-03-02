import { PREFIX } from '~/utils/configs';

export default {
  name: `${PREFIX}select-dropdown-option`,

  render(h) {
    return h(
      'div',
      {
        class: `${PREFIX}select__option ${PREFIX}select__option--static`
      },
      this.$slots.default
    );
  }
};
