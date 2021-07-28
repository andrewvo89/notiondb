import { Filter, NotionPropertyFilter } from '..';
import { TextFilterTypes } from '.';

/**
 * Class representing a TextFilter.
 * @class TextFilter
 * @implements {Filter}
 */
class TextFilter implements Filter {
  #property: string;
  #type: TextFilterTypes;
  #value: string | boolean;

  /**
   * Creates an instance of TextFilter.
   * @param {string} property
   * @param {TextFilterTypes} type
   * @param {(string | boolean)} value
   * @memberof TextFilter
   */
  constructor(
    property: string,
    type: TextFilterTypes,
    value: string | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Checkbox Text property.
   * @readonly
   * @type {string}
   * @memberof TextFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Get the Text filter type.
   * @readonly
   * @type {TextFilterTypes}
   * @memberof TextFilter
   */
  get type(): TextFilterTypes {
    return this.#type;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof TextFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      text: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { TextFilter };
export * from './types';
