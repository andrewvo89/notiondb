import { axios } from './utils/api';
import { Database } from './models';

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
    axios.defaults.headers.common.Authorization = integrationToken;
  }

  /**
   * Static Database methods.
   * @readonly
   * @memberof NotionDB
   */
  get databases() {
    return {
      get: Database.get,
      getAll: Database.getAll,
      create: Database.create,
    };
  }
}

export { NotionDB };
