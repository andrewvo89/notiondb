import { Sort, SortDirection } from '../types';

class PropertySort implements Sort {
  #property: string;
  #direction: SortDirection;

  constructor(property: string, direction: SortDirection) {
    this.#property = property;
    this.#direction = direction;
  }

  get property() {
    return this.#property;
  }

  transformToNotionSort() {
    return {
      property: this.#property,
      direction: this.#direction,
    };
  }
}

export default PropertySort;
