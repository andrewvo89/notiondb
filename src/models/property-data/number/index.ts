import { PropertyData } from '../types';
import { NumberNotionValue } from './types';

class Number implements PropertyData {
  #value: number;
  constructor(value: number) {
    this.#value = value;
  }

  get notionValue(): NumberNotionValue {
    return {
      number: this.#value,
    };
  }

  static getValue(notionValue: NumberNotionValue) {
    return notionValue.number;
  }
}

export default Number;