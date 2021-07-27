import { CheckboxFilterTypes } from './types';
import { Filter } from '../types';

class CheckboxFilter implements Filter {
  #property: string;
  #type: CheckboxFilterTypes;
  #value: boolean;

  constructor(property: string, type: CheckboxFilterTypes, value: boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  get property() {
    return this.#property;
  }

  get type() {
    return this.#type;
  }

  transformToNotionFilter() {
    return {
      property: this.#property,
      checkbox: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default CheckboxFilter;
