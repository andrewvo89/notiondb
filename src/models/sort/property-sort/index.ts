import { NotionSort, Sort, SortDirection } from '..';

/**
 * Class representing a PropertySort.
 * @class PropertySort
 * @implements {Sort}
 */
class PropertySort implements Sort {
  #property: string;
  #direction: SortDirection;

  /**
   * Creates an instance of PropertySort.
   * @param {string} property
   * @param {SortDirection} direction
   * @memberof PropertySort
   */
  constructor(property: string, direction: SortDirection) {
    this.#property = property;
    this.#direction = direction;
  }

  /**
   * Get the PropertyAndTimestampSort sort property.
   * @readonly
   * @type {string}
   * @memberof PropertySort
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms sort into a Notion friendly sort.
   * @return {*}  {NotionSort}
   * @memberof PropertySort
   */
  transformToNotionSort(): NotionSort {
    return {
      property: this.#property,
      direction: this.#direction,
    };
  }
}

export { PropertySort };
