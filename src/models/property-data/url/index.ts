import { PropertyData } from '../types';
import { URLNotionValue } from './types';

class URL implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): URLNotionValue {
    return {
      url: this.#value,
    };
  }

  static getValue(notionValue: URLNotionValue) {
    return notionValue.url;
  }
}

export default URL;
