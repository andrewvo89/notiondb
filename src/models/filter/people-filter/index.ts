import { Filter } from '../types';
import { PeopleFilterTypes } from './types';

class PeopleFilter implements Filter {
  #property: string;
  #type: PeopleFilterTypes;
  #value: number | boolean;

  constructor(
    property: string,
    type: PeopleFilterTypes,
    value: number | boolean,
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
      people: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default PeopleFilter;
