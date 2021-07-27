import axios, { BACK_OFF_TIME, MAX_RETRIES } from './utils/api';
import Database from './models/database';
import NotionId from './models/notion/notion-id';
import NotionUrl from './models/notion/notion-url';
import { DatabaseResponse } from './models/database/types';
import { NotionProperty } from './models/notion/types';
import { NotionUrlTypes } from './models/notion/notion-url/types';
import SchemaObject from './models/property-schema/schema-object';
import Number from './models/property/number';
import PropertySchema from './models/property-schema';
import Property from './models/property';
import Checkbox from './models/property/checkbox';

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

export default NotionDB;
