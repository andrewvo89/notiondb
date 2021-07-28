import { CheckboxFilter, CheckboxFilterTypes } from '../checkbox-filter';
import { DateFilter, DateFilterTypes } from '../date-filter';
import { NumberFilter, NumberFilterTypes } from '../number-filter';
import { TextFilter, TextFilterTypes } from '../text-filter';

type FormulaFilterTypes =
  | TextFilterTypes
  | CheckboxFilterTypes
  | NumberFilterTypes
  | DateFilterTypes;

type FormulaFilters = TextFilter | CheckboxFilter | NumberFilter | DateFilter;

export { FormulaFilters, FormulaFilterTypes };
