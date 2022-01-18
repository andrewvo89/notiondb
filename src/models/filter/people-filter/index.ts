import { Filter, NotionPropertyFilter } from '..';

import { PeopleFilterTypes } from '.';

/**
 * Class representing a PeopleFilter.
 * @class PeopleFilter
 * @implements {Filter}
 */
class PeopleFilter implements Filter {
  #property: string;
  #type: PeopleFilterTypes;
  #value: number | boolean;

  /**
   * Creates an instance of PeopleFilter.
   * @param {string} property
   * @param {PeopleFilterTypes} type
   * @param {(number | boolean)} value
   * @memberof PeopleFilter
   */
  constructor(property: string, type: PeopleFilterTypes, value: number | boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Checkbox filter property.
   * @readonly
   * @type {string}
   * @memberof PeopleFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof PeopleFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      people: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { PeopleFilter };
export * from './types';
