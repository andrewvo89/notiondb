import { PropertyData } from '../types';
import { TitleNotionValue } from './types';

/**
 * Class representing a Title Notion type.
 * @class Title
 * @implements {PropertyData}
 */
class Title implements PropertyData {
  #value: string;

  /**
   * Creates an instance of Title.
   * @param {string} value
   * @memberof Title
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {TitleNotionValue}
   * @memberof Title
   */
  get notionValue(): TitleNotionValue {
    return {
      title: [
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
   * @param {TitleNotionValue} notionValue
   * @return {*}  {string}
   * @memberof Title
   */
  static getValue(notionValue: TitleNotionValue): string {
    if (notionValue.title.length === 0) {
      return '';
    }
    return notionValue.title[0].text.content;
  }
}

export default Title;
