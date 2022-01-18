import { Filter, NotionPropertyFilter } from '..';

import { DateFilterTypes } from '.';

/**
 * Class representing a DateFilter.
 * @class CheckboxFilter
 * @implements {Filter}
 */
class DateFilter implements Filter {
  #property: string;
  #type: DateFilterTypes;
  #value: string | boolean | object;

  /**
   * Creates an instance of DateFilter.
   * @param {string} property
   * @param {DateFilterTypes} type
   * @param {(string | boolean | object)} value
   * @memberof DateFilter
   */
  constructor(property: string, type: DateFilterTypes, value: string | boolean | object) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Date filter property.
   * @readonly
   * @type {string}
   * @memberof DateFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Get the Date filter type.
   * @readonly
   * @type {DateFilterTypes}
   * @memberof DateFilter
   */
  get type(): DateFilterTypes {
    return this.#type;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof DateFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      date: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { DateFilter };
export * from './types';
