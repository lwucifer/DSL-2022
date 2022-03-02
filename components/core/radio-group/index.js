import { PREFIX } from '~/utils/configs';
import formCheckGroupMixin from '~/mixins/form-check-group';

const COMPONENT_CLASS = PREFIX + 'radio-group';

export default {
  name: COMPONENT_CLASS,

  mixins: [formCheckGroupMixin],
};
