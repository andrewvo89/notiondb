import { Database, NotionId, NotionUrl } from './models';

import { PropertySchema } from './schema';
import axios from 'axios';
import { setAxiosInstance } from './axios';

/**
 * Class representing a NotionDB.
 * @class NotionDB
 */
class NotionDB {
  /**
   * Creates an instance of NotionDB with an integration key.
   * An Integration needs to be created at https://www.notion.so/my-integrations.
   * @param {string} integrationToken
   * @memberof NotionDB
   */
  constructor(integrationToken: string) {
    const instance = axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        'Notion-Version': '2021-05-13',
        Authorization: integrationToken,
      },
    });
    setAxiosInstance(instance);
  }

  /**
   * Static Database methods.
   * @readonly
   * @memberof NotionDB
   */
  get databases() {
    return {
      get: (identifier: NotionUrl | NotionId) => Database.get(identifier),
      getAll: () => Database.getAll(),
      create: (parentPageIdentifier: NotionUrl | NotionId, title: string, schema: PropertySchema) =>
        Database.create(parentPageIdentifier, title, schema),
    };
  }
}

export { NotionDB };
