import { CompountFilterTypes } from './types';
import { Filter } from '../types';

/**
 * Class representing a CompoundFilter.
 * @class CompoundFilter
 * @implements {Filter}
 */
class CompoundFilter implements Filter {
  #filter1: Filter;
  #type: CompountFilterTypes;
  #filter2: Filter;

  /**
   * Creates an instance of a CompoundFilter.
   * @param {Filter} filter1
   * @param {CompountFilterTypes} type
   * @param {Filter} filter2
   * @memberof CompoundFilter
   */
  constructor(filter1: Filter, type: CompountFilterTypes, filter2: Filter) {
    this.#filter1 = filter1;
    this.#type = type;
    this.#filter2 = filter2;
  }

  /**
   * Gets the first filter.
   * @readonly
   * @type {Filter}
   * @memberof CompoundFilter
   */
  get filter1(): Filter {
    return this.#filter1;
  }

  /**
   * Gets the second filter
   * @readonly
   * @type {Filter}
   * @memberof CompoundFilter
   */
  get filter2(): Filter {
    return this.#filter2;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {Record<string, any>}
   * @memberof CompoundFilter
   */
  transformToNotionFilter(): Record<string, any> {
    return {
      [this.#type]: [
        this.#filter1.transformToNotionFilter(),
        this.#filter2.transformToNotionFilter(),
      ],
    };
  }
}

export default CompoundFilter;
