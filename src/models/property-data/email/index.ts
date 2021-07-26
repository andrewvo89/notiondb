import { PropertyData } from '../types';
import { EmailNotionValue } from './types';

class Email implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): EmailNotionValue {
    return {
      email: this.#value,
    };
  }

  static getValue(notionValue: EmailNotionValue) {
    return notionValue.email;
  }
}

export default Email;
