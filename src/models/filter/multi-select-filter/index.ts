import { Filter, NotionPropertyFilter } from '../types';
import { MultiSelectFilterTypes } from './types';

/**
 * Class representing a MultiSelectFilter.
 * @class MultiSelectFilter
 * @implements {Filter}
 */
/**
 *
 *
 * @class MultiSelectFilter
 * @implements {Filter}
 */
class MultiSelectFilter implements Filter {
  #property: string;
  #type: MultiSelectFilterTypes;
  #value: string | boolean;

  /**
   * Creates an instance of MultiSelectFilter.
   * @param {string} property
   * @param {MultiSelectFilterTypes} type
   * @param {(string | boolean)} value
   * @memberof MultiSelectFilter
   */
  constructor(
    property: string,
    type: MultiSelectFilterTypes,
    value: string | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Multi-Select filter property.
   * @readonly
   * @type {string}
   * @memberof MultiSelectFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof MultiSelectFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      multi_select: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default MultiSelectFilter;
