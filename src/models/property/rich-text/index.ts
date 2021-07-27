import { PropertyInterface } from '../types';
import { RichTextNotionValue, RichTextPropertyObject } from './types';

/**
 * Class representing a RichText Notion type.
 * @class RichText
 * @implements {PropertyInterface}
 */
class RichText implements PropertyInterface {
  #value: string;

  /**
   * Creates an instance of RichText.
   * @param {string} value
   * @memberof RichText
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {RichTextNotionValue}
   * @memberof RichText
   */
  get notionValue(): RichTextNotionValue {
    return {
      rich_text: [
        {
          type: 'text',
          text: {
            content: this.#value,
          },
        },
      ],
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {RichTextNotionValue} notionValue
   * @return {*}  {string}
   * @memberof RichText
   */
  static getValue(notionValue: RichTextNotionValue): string {
    if (notionValue.rich_text.length === 0) {
      return '';
    }
    return notionValue.rich_text[0].text.content;
  }
}

export default RichText;
