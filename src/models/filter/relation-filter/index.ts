import { Filter } from '../types';
import { RelationFilterTypes } from './types';

class RelationFilter implements Filter {
  #property: string;
  #type: RelationFilterTypes;
  #value: string | boolean;

  constructor(
    property: string,
    type: RelationFilterTypes,
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
      relation: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default RelationFilter;
