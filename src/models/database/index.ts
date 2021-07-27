import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import Page from '../page';
import User from '../user';
import { NotionProperty } from '../notion/types';
import { PageOptions } from '../page/types';

/**
 * Class representing a Notion Database.
 * @class Database
 */
class Database {
  #id: string;
  #title: string;
  #properties: NotionProperty[];

  /**
   * Creates an instance of Database.
   * @param {string} id
   * @param {string} title
   * @param {NotionProperty[]} properties
   * @memberof Database
   */
  constructor(id: string, title: string, properties: NotionProperty[]) {
    this.#id = id;
    this.#title = title;
    this.#properties = properties;
  }

  /**
   * Get Database ID.
   * @readonly
   * @type {string}
   * @memberof Database
   */
  get id(): string {
    return this.#id;
  }

  /**
   * Get Databae title.
   * @readonly
   * @type {string}
   * @memberof Database
   */
  get title(): string {
    return this.#title;
  }

  /**
   * Get Database properties.
   * @readonly
   * @type {NotionProperty[]}
   * @memberof Database
   */
  get properties(): NotionProperty[] {
    return this.#properties;
  }

  /**
   * Get access to Database pages.
   * @readonly
   * @memberof Database
   */
  get pages() {
    return {
      get: (identifier: NotionUrl | NotionId, excludeProperties?: string[]) =>
        Page.get(this.#properties, identifier, excludeProperties),
      getMany: (options: PageOptions, excludeProperties?: string[]) =>
        Page.getMany(this.#id, this.#properties, options, excludeProperties),
      getAll: (excludeProperties?: string[]) =>
        Page.getAll(this.#id, this.#properties, excludeProperties),
      create: (data: Record<string, any>) =>
        Page.create(this.#id, this.#properties, data),
      update: (identifier: NotionUrl | NotionId, data: Record<string, any>) =>
        Page.update(this.#properties, identifier, data),
      delete: (identifier: NotionUrl | NotionId) =>
        Page.delete(this.#properties, identifier),
      restore: (identifier: NotionUrl | NotionId) =>
        Page.restore(this.#properties, identifier),
    };
  }

  /**
   * Get access to Database users.
   * @readonly
   * @memberof Database
   */
  get users() {
    return {
      get: User.get,
      getAll: User.getAll,
    };
  }
}

export default Database;
