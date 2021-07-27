import { PhoneNumberNotionValue } from './types';
import { PropertyData } from '../types';

/**
 * Class representing a PhoneNumber Notion type.
 * @class PhoneNumber
 * @implements {PropertyData}
 */
class PhoneNumber implements PropertyData {
  #value: string;

  /**
   * Creates an instance of PhoneNumber.
   * @param {string} value
   * @memberof PhoneNumber
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {PhoneNumberNotionValue}
   * @memberof PhoneNumber
   */
  get notionValue(): PhoneNumberNotionValue {
    return {
      phone_number: this.#value,
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {PhoneNumberNotionValue} notionValue
   * @return {*}  {string}
   * @memberof PhoneNumber
   */
  static getValue(notionValue: PhoneNumberNotionValue): string {
    return notionValue.phone_number;
  }
}

export default PhoneNumber;
