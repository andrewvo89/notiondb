import axios, { BACK_OFF_TIME, MAX_RETRIES } from './utils/api';
import Database from './models/database';
import NotionId from './models/notion/notion-id';
import NotionUrl from './models/notion/notion-url';
import { DatabaseResponse } from './models/database/types';
import { NotionProperty } from './models/notion/types';

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

  /**
   * Gets all Notion Database References.
   * @return {*}  {Promise<Database[]>}
   * @memberof NotionDB
   */
  async getAllDatabaseRefs(): Promise<Database[]> {
    const databases: Database[] = [];
    let hasMore: boolean = false;
    let nextCursor: string = '';

    do {
      let retries = 0;
      const nextCursorParam: string = hasMore
        ? `?start_cursor=${nextCursor}`
        : '';
      try {
        const response = await axios.get(`/databases${nextCursorParam}`);

        const results = response.data.results as DatabaseResponse[];
        for (const result of results) {
          const properties = Object.values(result.properties).map(
            (property) =>
              ({
                id: property.id,
                name: property.name,
                type: property.type,
                value: property[property.type],
              } as NotionProperty),
          );
          const database = new Database(
            result.id,
            result.title.plain_text,
            properties,
          );
          databases.push(database);
        }
        hasMore = response.data.has_more;
        if (hasMore) {
          nextCursor = response.data.next_cursor;
        }
      } catch (error) {
        if (!error.isAxiosError) {
          throw new Error(error);
        }
        if (retries === MAX_RETRIES) {
          continue;
        }
        await new Promise((resolve) =>
          globalThis.setTimeout(() => {
            retries++;
            resolve(null);
          }, BACK_OFF_TIME),
        );
      }
    } while (hasMore);
    return databases;
  }

  /**
   * Gets a Notion Database Reference using a Notion URL or Notion ID.
   * @param {(NotionUrl | NotionId)} identifier
   * @return {*}  {Promise<Database>}
   * @memberof NotionDB
   */
  async getDatabaseRef(identifier: NotionUrl | NotionId): Promise<Database> {
    const databaseId = identifier.getId();
    let retries = 0;
    let database: Database | null = null;
    do {
      try {
        const response = await axios.get(`/databases/${databaseId}`);
        const databaseResult = response.data as DatabaseResponse;
        const properties = Object.values(databaseResult.properties).map(
          (property) =>
            ({
              id: property.id,
              name: property.name,
              type: property.type,
              value: property[property.type],
            } as NotionProperty),
        );
        database = new Database(
          databaseResult.id,
          databaseResult.title.plain_text,
          properties,
        );
      } catch (error) {
        if (retries === MAX_RETRIES) {
          break;
        }
        await new Promise((resolve) =>
          globalThis.setTimeout(() => {
            retries++;
            resolve(null);
          }, BACK_OFF_TIME),
        );
      }
    } while (!database);
    if (!database) {
      throw new Error(`Database ${databaseId} does not exist.`);
    }
    return database;
  }
}

export default NotionDB;
