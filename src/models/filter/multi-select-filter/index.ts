import { Filter } from '../types';
import { MultiSelectFilterTypes } from './types';

class MultiSelectFilter implements Filter {
  #property: string;
  #type: MultiSelectFilterTypes;
  #value: string | boolean;

  constructor(
    property: string,
    type: MultiSelectFilterTypes,
    value: string | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  get property() {
    return this.#property;
  }

  transformToNotionFilter() {
    return {
      property: this.#property,
      multi_select: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default MultiSelectFilter;
