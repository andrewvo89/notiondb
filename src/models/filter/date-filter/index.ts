import { DateFilterTypes } from './types';
import { Filter } from '../types';

class DateFilter implements Filter {
  #property: string;
  #type: DateFilterTypes;
  #value: string | boolean | object;

  constructor(
    property: string,
    type: DateFilterTypes,
    value: string | boolean | object,
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
      date: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default DateFilter;
