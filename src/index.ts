import { axios } from './utils/api';
import { Database } from './models';

/**
 * Class representing a NotionDB.
 * @class NotionDB
 */
class NotionDB {
  /**
   * Creates an instance of NotionDB.
   * @param {string} integrationToken
   * @memberof NotionDB
   */
  constructor(integrationToken: string) {
    axios.defaults.headers.common.Authorization = integrationToken;
  }

  get databases() {
    return {
      get: Database.get,
      getAll: Database.getAll,
      create: Database.create,
    };
  }
}

export { NotionDB };
