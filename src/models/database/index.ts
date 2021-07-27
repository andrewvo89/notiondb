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
      get: (identifer: NotionUrl | NotionId, excludeProperties?: string[]) =>
        Page.get(this.#properties, identifer, excludeProperties),
      getMany: (options: PageOptions) =>
        Page.getMany(this.#id, this.#properties, options),
      getAll: (excludeProperties?: string[]) =>
        Page.getAll(this.#id, this.#properties, excludeProperties),
      create: (data: Record<string, any>) =>
        Page.create(this.#id, this.#properties, data),
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
