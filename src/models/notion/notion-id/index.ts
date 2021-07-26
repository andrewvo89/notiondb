import { getIdFromId } from '../../../utils/notion';

class NotionId {
  #id: string;
  constructor(id: string) {
    this.#id = id;
  }

  getId() {
    return getIdFromId(this.#id);
  }

  get id() {
    return this.#id;
  }
}

export default NotionId;
