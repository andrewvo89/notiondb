import { PropertyData } from '../types';
import { SelectNotionValue } from './types';

class Select implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): SelectNotionValue {
    return {
      select: {
        name: this.#value,
      },
    };
  }

  static getValue(notionValue: SelectNotionValue) {
    return notionValue.select;
  }
}

export default Select;
