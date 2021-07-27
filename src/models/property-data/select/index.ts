import { PropertyData } from '../types';
import { SelectNotionValue } from './types';

/**
 * Class representing a Select Notion type.
 * @class Select
 * @implements {PropertyData}
 */
class Select implements PropertyData {
  #value: string;

  /**
   * Creates an instance of Select.
   * @param {string} value
   * @memberof Select
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {SelectNotionValue}
   * @memberof Select
   */
  get notionValue(): SelectNotionValue {
    return {
      select: {
        name: this.#value,
      },
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {SelectNotionValue} notionValue
   * @return {*}  {string}
   * @memberof Select
   */
  static getValue(notionValue: SelectNotionValue): string {
    return notionValue.select.name;
  }
}

export default Select;
