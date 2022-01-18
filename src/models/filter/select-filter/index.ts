import { Filter, NotionPropertyFilter } from '..';

import { SelectFilterTypes } from '.';

/**
 * Class representing a SelectFilter.
 * @class SelectFilter
 * @implements {Filter}
 */
class SelectFilter implements Filter {
  #property: string;
  #type: SelectFilterTypes;
  #value: string | boolean;

  /**
   * Creates an instance of SelectFilter.
   * @param {string} property
   * @param {SelectFilterTypes} type
   * @param {(string | boolean)} value
   * @memberof SelectFilter
   */
  constructor(property: string, type: SelectFilterTypes, value: string | boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Select filter property.
   * @readonly
   * @type {string}
   * @memberof SelectFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof SelectFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      select: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { SelectFilter };
export * from './types';
