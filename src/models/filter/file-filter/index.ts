import { FileFilterTypes } from './types';
import { Filter, NotionPropertyFilter } from '../types';

/**
 * Class representing a FileFilter.
 * @class FileFilter
 * @implements {Filter}
 */
class FileFilter implements Filter {
  #property: string;
  #type: FileFilterTypes;
  #value: boolean;

  /**
   * Creates an instance of FileFilter.
   * @param {string} property
   * @param {FileFilterTypes} type
   * @param {boolean} value
   * @memberof FileFilter
   */
  constructor(property: string, type: FileFilterTypes, value: boolean) {
    this.#property = property;
    this.#type = type;
    this.#value = value;
  }

  /**
   * Get the File filter property.
   * @readonly
   * @type {string}
   * @memberof FileFilter
   */
  get property(): string {
    return this.#property;
  }

  /**
   * Transforms filter into a Notion friendly filter.
   * @return {*}  {NotionPropertyFilter}
   * @memberof FileFilter
   */
  transformToNotionFilter(): NotionPropertyFilter {
    return {
      property: this.#property,
      file: {
        [this.#type]: this.#value,
      },
    };
  }
}

export default FileFilter;
