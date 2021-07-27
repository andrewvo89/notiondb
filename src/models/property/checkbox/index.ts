import { CheckboxNotionValue, CheckboxPropertyObject } from './types';
import { PropertyInterface } from '../types';

/**
 * Class representing a Checkbox Notion type.
 * @class Checkbox
 * @implements {PropertyInterface}
 */
class Checkbox implements PropertyInterface {
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
