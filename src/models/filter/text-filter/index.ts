import { Filter } from '../types';
import { TextFilterTypes } from './types';

class TextFilter implements Filter {
  #property: string;
  #type: TextFilterTypes;
  #value: any;

  constructor(property: string, type: TextFilterTypes, value: any) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  transformToNotionFilter() {
    return {
      property: this.#property,
      text: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default TextFilter;
