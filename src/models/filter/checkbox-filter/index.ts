import { CheckboxFilterTypes } from '.';
import { Filter, NotionPropertyFilter } from '..';

/**
 * Class representing a CheckboxFilter.
 * @class CheckboxFilter
 * @implements {Filter}
 */
class CheckboxFilter implements Filter {
  #property: string;
  #type: CheckboxFilterTypes;
  #value: boolean;

  /**
   * Creates an instance of CheckboxFilter.
   * @param {string} property
   * @param {CheckboxFilterTypes} type
   * @param {boolean} value
   * @memberof CheckboxFilter
   */
  constructor(property: string, type: CheckboxFilterTypes, value: boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Checkbox filter property.
   * @readonly
   * @type {string}
   * @memberof CheckboxFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Get the Checkbox filter type.
   * @readonly
   * @type {CheckboxFilterTypes}
   * @memberof CheckboxFilter
   */
  get type(): CheckboxFilterTypes {
    return this.#type;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof CheckboxFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      checkbox: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { CheckboxFilter };
export * from './types';
