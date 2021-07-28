import { EmailNotionValue } from '.';
import { PropertyInterface } from '..';

/**
 * Class representing a Email Notion type.
 * @class Email
 * @implements {PropertyInterface}
 */
class Email implements PropertyInterface {
  #value: string;

  /**
   * Creates an instance of Email.
   * @param {string} value
   * @memberof Email
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {EmailNotionValue}
   * @memberof Email
   */
  get notionValue(): EmailNotionValue {
    return {
      email: this.#value,
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {EmailNotionValue} notionValue
   * @return {*}  {string}
   * @memberof Email
   */
  static getValue(notionValue: EmailNotionValue): string {
    return notionValue.email;
  }
}

export { Email };
export * from './types';
