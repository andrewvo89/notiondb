import { Sort, SortDirection, TimestampSortType } from '../types';

class PropertyAndTimestampSort implements Sort {
  #property: string;
  #timestamp: TimestampSortType;
  #direction: SortDirection;

  constructor(
    property: string,
    timestamp: TimestampSortType,
    direction: SortDirection,
  ) {
    this.#property = property;
    this.#timestamp = timestamp;
    this.#direction = direction;
  }

  get property() {
    return this.#property;
  }

  transformToNotionSort() {
    return {
      property: this.#property,
      timestamp: this.#timestamp,
      direction: this.#direction,
    };
  }
}

export default PropertyAndTimestampSort;
