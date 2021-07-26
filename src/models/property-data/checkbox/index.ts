import { PropertyData } from '../types';
import { CheckboxNotionValue } from './types';

class Checkbox implements PropertyData {
  #value: boolean;

  constructor(value: boolean) {
    this.#value = value;
  }

  get notionValue(): CheckboxNotionValue {
    return {
      checkbox: this.#value,
    };
  }

  static getValue(notionValue: CheckboxNotionValue) {
    return notionValue.checkbox;
  }
}

export default Checkbox;
