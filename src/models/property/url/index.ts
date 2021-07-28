import { PropertyInterface } from '..';
import { URLNotionValue } from '.';

/**
 * Class representing a URL Notion type.
 * @class URL
 * @implements {PropertyInterface}
 */
class URL implements PropertyInterface {
  #value: string;

  /**
   * Creates an instance of URL.
   * @param {string} value
   * @memberof URL
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {URLNotionValue}
   * @memberof URL
   */
  get notionValue(): URLNotionValue {
    return {
      url: this.#value,
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {URLNotionValue} notionValue
   * @return {*}  {string}
   * @memberof URL
   */
  static getValue(notionValue: URLNotionValue): string {
    return notionValue.url;
  }
}

export { URL };
export * from './types';
