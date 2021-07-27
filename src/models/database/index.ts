import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import Page from '../page';
import { NotionProperty } from '../notion/types';
import { PageOptions } from '../page/types';
import { User } from '../user';

class Database {
  #id: string;
  #title: string;
  #properties: NotionProperty[];

  constructor(id: string, title: string, properties: NotionProperty[]) {
    this.#id = id;
    this.#title = title;
    this.#properties = properties;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get properties() {
    return this.#properties;
  }

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

  get users() {
    return {
      get: User.get,
      getAll: User.getAll,
    };
  }
}

export default Database;
