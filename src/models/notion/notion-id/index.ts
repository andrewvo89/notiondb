import { getIdFromId } from '../../../utils/notion';

/**
 * Class representing a Notion ID.
 * @class NotionId
 */
class NotionId {
  #id: string;
  constructor(id: string) {
    this.#id = id;
  }

  /**
   * Validates the ID.
   * @return {*}  {string}
   * @memberof NotionId
   */
  getId(): string {
    return getIdFromId(this.#id);
  }

  /**
   * Get the Notion ID.
   * @readonly
   * @type {string}
   * @memberof NotionId
   */
  get id(): string {
    return this.#id;
  }
}

export default NotionId;
