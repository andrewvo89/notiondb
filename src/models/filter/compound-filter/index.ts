import { CompountFilterTypes } from '.';
import { Filter } from '..';

/**
 * Class representing a CompoundFilter.
 * @class CompoundFilter
 * @implements {Filter}
 */
class CompoundFilter implements Filter {
  #filters: Filter[];
  #type: CompountFilterTypes;

  /**
   * Creates an instance of a CompoundFilter.
   * @param {Filter[]} filters
   * @param {CompountFilterTypes} type
   * @memberof CompoundFilter
   */
  constructor(filters: Filter[], type: CompountFilterTypes) {
    this.#filters = filters;
    this.#type = type;
  }

  /**
   * Gets the array of Filters.
   * @readonly
   * @type {Filter[]}
   * @memberof CompoundFilter
   */
  get filters(): Filter[] {
    return this.#filters;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {Record<string, any>}
   * @memberof CompoundFilter
   */
  transformToNotionFilter(): Record<string, any> {
    return {
      [this.#type]: this.#filters.map((filter) =>
        filter.transformToNotionFilter(),
      ),
    };
  }
}

export { CompoundFilter };
export * from './types';
