import { NumberNotionValue } from '.';
import { PropertyInterface } from '..';

/**
 * Class representing a Number Notion type.
 * @class Number
 * @implements {PropertyInterface}
 */
class Number implements PropertyInterface {
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

export { Number };
export * from './types';
