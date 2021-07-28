import { Filter, NotionPropertyFilter } from '..';
import { RelationFilterTypes } from '.';

/**
 * Class representing a RelationFilter.
 * @class RelationFilter
 * @implements {Filter}
 */
class RelationFilter implements Filter {
  #property: string;
  #type: RelationFilterTypes;
  #value: string | boolean;

  /**
   * Creates an instance of RelationFilter.
   * @param {string} property
   * @param {RelationFilterTypes} type
   * @param {(string | boolean)} value
   * @memberof RelationFilter
   */
  constructor(
    property: string,
    type: RelationFilterTypes,
    value: string | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the Relation filter property.
   * @readonly
   * @type {string}
   * @memberof RelationFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof RelationFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      relation: {
        [this.#type]: this.#value,
      },
    };
  }
}

export { RelationFilter };
export * from './types';
