import { TextFilterTypes } from '../../filter/text-filter/types';
import { PropertyData } from '../types';
import { TitleNotionValue } from './types';

class Title implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

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

  static getValue(notionValue: TitleNotionValue) {
    if (notionValue.title.length === 0) {
      return '';
    }
    return notionValue.title[0].text.content;
  }
}

export default Title;
