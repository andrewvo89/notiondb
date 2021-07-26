import { getIdFromUrl } from '../../../utils/notion';
import { NotionUrlTypes } from './types';

class NotionUrl {
  #url: string;
  #type: NotionUrlTypes;

  constructor(url: string, type: NotionUrlTypes) {
    this.#url = url;
    this.#type = type;
  }

  getId(): string {
    return getIdFromUrl(this.#url, this.#type);
  }

  get url() {
    return this.#url;
  }
}

export default NotionUrl;
