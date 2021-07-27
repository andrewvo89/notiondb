import { Filter } from '../types';
import { SelectFilterTypes } from './types';

class SelectFilter implements Filter {
  #property: string;
  #type: SelectFilterTypes;
  #value: string | boolean;

  constructor(
    property: string,
    type: SelectFilterTypes,
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
      select: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default SelectFilter;
