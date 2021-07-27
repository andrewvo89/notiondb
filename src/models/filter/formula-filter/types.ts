import CheckboxFilter from '../checkbox-filter';
import DateFilter from '../date-filter';
import NumberFilter from '../number-filter';
import TextFilter from '../text-filter';
import { CheckboxFilterTypes } from '../checkbox-filter/types';
import { DateFilterTypes } from '../date-filter/types';
import { NumberFilterTypes } from '../number-filter/types';
import { TextFilterTypes } from '../text-filter/types';

type FormulaFilterTypes =
  | TextFilterTypes
  | CheckboxFilterTypes
  | NumberFilterTypes
  | DateFilterTypes;

type FormulaFilters = TextFilter | CheckboxFilter | NumberFilter | DateFilter;

export { FormulaFilters, FormulaFilterTypes };
