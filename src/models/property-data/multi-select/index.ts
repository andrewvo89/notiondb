import { MultiSelectNotionValue } from './types';
import { PropertyData } from '../types';

/**
 * Class representing a MultiSelect Notion type.
 * @class MultiSelect
 * @implements {PropertyData}
 */
class MultiSelect implements PropertyData {
  #values: string[];

  /**
   * Creates an instance of MultiSelect.
   * @param {string[]} values
   * @memberof MultiSelect
   */
  constructor(values: string[]) {
    this.#values = values;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {MultiSelectNotionValue}
   * @memberof MultiSelect
   */
  get notionValue(): MultiSelectNotionValue {
    return {
      multi_select: this.#values.map((value) => ({ name: value })),
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {MultiSelectNotionValue} notionValue
   * @return {*}  {string[]}
   * @memberof MultiSelect
   */
  static getValue(notionValue: MultiSelectNotionValue): string[] {
    return notionValue.multi_select.map((value) => value.name);
  }
}

export default MultiSelect;
