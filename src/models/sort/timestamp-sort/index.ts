import { Sort, SortDirection, TimestampSortType } from '../types';

class TimestampSort implements Sort {
  #timestamp: TimestampSortType;
  #direction: SortDirection;

  constructor(timestamp: TimestampSortType, direction: SortDirection) {
    this.#timestamp = timestamp;
    this.#direction = direction;
  }

  transformToNotionSort() {
    return {
      timestamp: this.#timestamp,
      direction: this.#direction,
    };
  }
}

export default TimestampSort;
