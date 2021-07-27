import { PropertyData } from '../types';
import { RichTextNotionValue } from './types';

class RichText implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

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

  static getValue(notionValue: RichTextNotionValue) {
    if (notionValue.rich_text.length === 0) {
      return '';
    }
    return notionValue.rich_text[0].text.content;
  }
}

export default RichText;
