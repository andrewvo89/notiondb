import { PhoneNumberNotionValue } from './types';
import { PropertyData } from '../types';

class PhoneNumber implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): PhoneNumberNotionValue {
    return {
      phone_number: this.#value,
    };
  }

  static getValue(notionValue: PhoneNumberNotionValue) {
    return notionValue.phone_number;
  }
}

export default PhoneNumber;
