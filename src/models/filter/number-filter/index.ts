import { Filter } from '../types';
import { NumberFilterTypes } from './types';

class NumberFilter implements Filter {
  #property: string;
  #type: NumberFilterTypes;
  #value: any;

  constructor(property: string, type: NumberFilterTypes, value: any) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
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
