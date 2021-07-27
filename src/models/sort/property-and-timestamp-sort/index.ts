import { NotionSort, Sort, SortDirection, TimestampSortType } from '../types';

/**
 * Class representing a PropertyAndTimestampSort.
 * @class PropertyAndTimestampSort
 * @implements {Sort}
 */
class PropertyAndTimestampSort implements Sort {
  #property: string;
  #timestamp: TimestampSortType;
  #direction: SortDirection;

  /**
   * Creates an instance of PropertyAndTimestampSort.
   * @param {string} property
   * @param {TimestampSortType} timestamp
   * @param {SortDirection} direction
   * @memberof PropertyAndTimestampSort
   */
  constructor(
    property: string,
    timestamp: TimestampSortType,
    direction: SortDirection,
  ) {
    this.#property = property;
    this.#timestamp = timestamp;
    this.#direction = direction;
  }

  /**
   * Get the PropertyAndTimestampSort sort property.
   * @readonly
   * @type {string}
   * @memberof PropertyAndTimestampSort
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms sort into a Notion friendly sort.
   * @return {*}  {NotionSort}
   * @memberof PropertyAndTimestampSort
   */
  transformToNotionSort(): NotionSort {
    return {
      property: this.#property,
      timestamp: this.#timestamp,
      direction: this.#direction,
    };
  }
}

export default PropertyAndTimestampSort;
