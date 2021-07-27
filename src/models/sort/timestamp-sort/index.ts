import { NotionSort, Sort, SortDirection, TimestampSortType } from '../types';

/**
 * Class representing a TimestampSort.
 * @class TimestampSort
 * @implements {Sort}
 */
class TimestampSort implements Sort {
  #timestamp: TimestampSortType;
  #direction: SortDirection;

  /**
   * Creates an instance of TimestampSort.
   * @param {TimestampSortType} timestamp
   * @param {SortDirection} direction
   * @memberof TimestampSort
   */
  constructor(timestamp: TimestampSortType, direction: SortDirection) {
    this.#timestamp = timestamp;
    this.#direction = direction;
  }

  /**
   * Transforms sort into a Notion friendly sort.
   * @return {*}  {NotionSort}
   * @memberof TimestampSort
   */
  transformToNotionSort(): NotionSort {
    return {
      timestamp: this.#timestamp,
      direction: this.#direction,
    };
  }
}

export default TimestampSort;
