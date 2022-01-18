import { NotionUrlTypes } from '.';
import { getIdFromUrl } from '../../../utils/notion';

/**
 * Class representing a Notion URL.
 * @class NotionUrl
 */
class NotionUrl {
  #url: string;
  #type: NotionUrlTypes;

  /**
   * Creates an instance of NotionUrl.
   * @param {string} url
   * @param {NotionUrlTypes} type
   * @memberof NotionUrl
   */
  constructor(url: string, type: NotionUrlTypes) {
    this.#url = url;
    this.#type = type;
  }

  /**
   * Gets the Notion ID from the URL.
   * @return {*}  {string}
   * @memberof NotionUrl
   */
  getId(): string {
    return getIdFromUrl(this.#url, this.#type);
  }

  /**
   * Gets the Notion URL.
   * @readonly
   * @memberof NotionUrl
   */
  get url() {
    return this.#url;
  }
}

export { NotionUrl };
export * from './types';
