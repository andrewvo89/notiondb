import CheckboxFilter from '../checkbox-filter';
import DateFilter from '../date-filter';
import NumberFilter from '../number-filter';
import TextFilter from '../text-filter';
import { Filter } from '../types';
import { FormulaFilterTypes } from './types';

class FormulaFilter implements Filter {
  #property: string;
  #type: FormulaFilterTypes;
  #value: Record<string, any>;

  constructor(type: TextFilter | CheckboxFilter | NumberFilter | DateFilter) {
    this.#type = type.type;
    this.#property = type.property;
    this.#value = type.transformToNotionFilter();
  }

  get property() {
    return this.#property;
  }

  transformToNotionFilter() {
    const formula = { ...this.#value };
    delete formula.property;
    return {
      property: this.#property,
      formula,
    };
  }
}

export default FormulaFilter;
