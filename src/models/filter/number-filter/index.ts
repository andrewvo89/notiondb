import { Filter } from '../types';
import { NumberFilterTypes } from './types';

class NumberFilter implements Filter {
  #property: string;
  #type: NumberFilterTypes;
  #value: number | boolean;

  constructor(
    property: string,
    type: NumberFilterTypes,
    value: number | boolean,
  ) {
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
      number: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default NumberFilter;
