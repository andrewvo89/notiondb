import { NumberNotionValue } from './types';
import { PropertyData } from '../types';

/**
 * Class representing a Number Notion type.
 * @class Number
 * @implements {PropertyData}
 */
class Number implements PropertyData {
  #value: number;

  /**
   * Creates an instance of Number.
   * @param {number} value
   * @memberof Number
   */
  constructor(value: number) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {NumberNotionValue}
   * @memberof Number
   */
  get notionValue(): NumberNotionValue {
    return {
      number: this.#value,
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {NumberNotionValue} notionValue
   * @return {*}  {number}
   * @memberof Number
   */
  static getValue(notionValue: NumberNotionValue): number {
    return notionValue.number;
  }
}

export default Number;
