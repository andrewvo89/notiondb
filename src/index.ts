import axios, { AxiosInstance } from 'axios';
import { Database, NotionId, NotionUrl } from './models';
import { PropertySchema } from './schema';

/**
 * Class representing a NotionDB.
 * @class NotionDB
 */
class NotionDB {
  #axiosInstance: AxiosInstance;
  /**
   * Creates an instance of NotionDB with an integration key.
   * An Integration needs to be created at https://www.notion.so/my-integrations.
   * @param {string} integrationToken
   * @memberof NotionDB
   */
  constructor(integrationToken: string) {
    const axiosInstance = axios.create({
      baseURL: 'https://api.notion.com/v1',
      headers: {
        'Notion-Version': '2021-05-13',
        Authorization: integrationToken,
      },
    });
    this.#axiosInstance = axiosInstance;
  }

  /**
   * Static Database methods.
   * @readonly
   * @memberof NotionDB
   */
  get databases() {
    return {
      get: (identifier: NotionUrl | NotionId) =>
        Database.get(identifier, this.#axiosInstance),
      getAll: () => Database.getAll(this.#axiosInstance),
      create: (
        parentPageIdentifier: NotionUrl | NotionId,
        title: string,
        schema: PropertySchema,
      ) =>
        Database.create(
          parentPageIdentifier,
          title,
          schema,
          this.#axiosInstance,
        ),
    };
  }
}

export { NotionDB };
