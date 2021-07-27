import { FileFilterTypes } from './types';
import { Filter } from '../types';

class FileFilter implements Filter {
  #property: string;
  #type: FileFilterTypes;
  #value: boolean;

  constructor(property: string, type: FileFilterTypes, value: boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  get property() {
    return this.#property;
  }

  transformToNotionFilter() {
    return {
      property: this.#property,
      file: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default FileFilter;
