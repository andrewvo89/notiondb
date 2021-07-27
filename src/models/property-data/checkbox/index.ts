import { CheckboxNotionValue } from './types';
import { PropertyData } from '../types';

/**
 * Class representing a Checkbox Notion type.
 * @class Checkbox
 * @implements {PropertyData}
 */
class Checkbox implements PropertyData {
  #value: boolean;

  /**
   * Creates an instance of Checkbox.
   * @param {boolean} value
   * @memberof Checkbox
   */
  constructor(value: boolean) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {CheckboxNotionValue}
   * @memberof Checkbox
   */
  get notionValue(): CheckboxNotionValue {
    return {
      checkbox: this.#value,
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {CheckboxNotionValue} notionValue
   * @return {*}  {boolean}
   * @memberof Checkbox
   */
  static getValue(notionValue: CheckboxNotionValue): boolean {
    return notionValue.checkbox;
  }
}

export default Checkbox;
