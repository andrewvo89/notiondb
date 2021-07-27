import { MultiSelectNotionValue } from './types';
import { PropertyData } from '../types';

class MultiSelect implements PropertyData {
  #values: string[];

  constructor(values: string[]) {
    this.#values = values;
  }

  get notionValue(): MultiSelectNotionValue {
    return {
      multi_select: this.#values.map((value) => ({ name: value })),
    };
  }

  static getValue(notionValue: MultiSelectNotionValue) {
    return notionValue.multi_select.map((value) => value.name);
  }
}

export default MultiSelect;
