import CheckboxFilter from '../checkbox-filter';
import DateFilter from '../date-filter';
import NumberFilter from '../number-filter';
import TextFilter from '../text-filter';
import { Filter, NotionPropertyFilter } from '../types';
import { FormulaFilterTypes } from './types';

/**
 * Class representing a ForumlaFilter.
 * @class FormulaFilter
 * @implements {Filter}
 */
class FormulaFilter implements Filter {
  #property: string;
  #type: FormulaFilterTypes;
  #value: Record<string, any>;

  /**
   * Creates an instance of FormulaFilter.
   * @param {(TextFilter | CheckboxFilter | NumberFilter | DateFilter)} type
   * @memberof FormulaFilter
   */
  constructor(type: TextFilter | CheckboxFilter | NumberFilter | DateFilter) {
    this.#type = type.type;
    this.#property = type.property;
    this.#value = type.transformToNotionFilter();
  }

  /**
   * Get the Formula filter property.
   * @readonly
   * @type {string}
   * @memberof FormulaFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof FormulaFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    const formula = { ...this.#value };
    delete formula.property;
    return {
      property: this.#property,
      formula,
    };
  }
}

export default FormulaFilter;