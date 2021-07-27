import { Filter, NotionPropertyFilter } from '../types';
import { NumberFilterTypes } from './types';

/**
 * Class representing a NumberFilter.
 * @class NumberFilter
 * @implements {Filter}
 */
class NumberFilter implements Filter {
  #property: string;
  #type: NumberFilterTypes;
  #value: number | boolean;

  /**
   * Creates an instance of NumberFilter.
   * @param {string} property
   * @param {NumberFilterTypes} type
   * @param {(number | boolean)} value
   * @memberof NumberFilter
   */
  constructor(
    property: string,
    type: ,
    value: number | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Number filter property.
   * @readonly
   * @type {string}
   * @memberof NumberFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Get the Number filter type.
   * @readonly
   * @type {NumberFilterTypes}
   * @memberof NumberFilter
   */
  get type(): NumberFilterTypes {
    return this.#type;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof NumberFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      number: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default NumberFilter;
