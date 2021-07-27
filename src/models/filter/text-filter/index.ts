import { Filter } from '../types';
import { TextFilterTypes } from './types';

class TextFilter implements Filter {
  #property: string;
  #type: TextFilterTypes;
  #value: string | boolean;

  constructor(
    property: string,
    type: TextFilterTypes,
    value: string | boolean,
  ) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  get property() {
    return this.#property;
  }

  get type() {
    return this.#type;
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
