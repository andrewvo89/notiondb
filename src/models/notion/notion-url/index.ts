import { getIdFromUrl } from '../../../utils/notion';
import { NotionUrlTypes } from '.';

/**
 * Class representing a Notion URL.
 * @class NotionUrl
 */
class NotionUrl {
  #url: string;
  #type: NotionUrlTypes;

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
