import Database from './models/database';
import { DatabaseResponse } from './models/database/types';
import axios, { BACK_OFF_TIME, MAX_RETRIES } from './utils/api';
import { NotionProperty } from './models/notion/types';
import { AxiosError } from 'axios';
import dotenv from 'dotenv';
import NotionUrl from './models/notion/notion-url';
import NotionId from './models/notion/notion-id';
import { getIdFromId, getIdFromUrl } from './utils/notion';

class NotionDB {
  constructor(integrationToken: string) {
    axios.defaults.headers.common['Authorization'] = integrationToken;
  }

  async getAllDatabases(): Promise<Database[]> {
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
        hasMore = response.data['has_more'];
        if (hasMore) {
          nextCursor = response.data['next_cursor'];
        }
      } catch (e) {
        console.error(e.message);
        retries++;

        if (retries === MAX_RETRIES) {
          continue;
        }

        const error = e as AxiosError;
        if (error.isAxiosError && error.response?.status === 404) {
          await new Promise((resolve) =>
            globalThis.setTimeout(() => {
              resolve(null);
            }, BACK_OFF_TIME),
          );
        }
      }
    } while (hasMore);
    return databases;
  }

  async getDatabaseRef(identifer: NotionUrl | NotionId): Promise<Database> {
    let databaseId: string = '';
    if (identifer instanceof NotionUrl) {
      databaseId = getIdFromUrl(identifer);
    } else if (identifer instanceof NotionId) {
      databaseId = getIdFromId(identifer);
    }
    let retries = 0;
    let database: Database | null = null;
    do {
      try {
        const response = await axios.get(`/databases/${databaseId}`);
        const result = response.data as DatabaseResponse;
        const properties = Object.values(result.properties).map(
          (property) =>
            ({
              id: property.id,
              name: property.name,
              type: property.type,
              value: property[property.type],
            } as NotionProperty),
        );
        database = new Database(result.id, result.title.plain_text, properties);
      } catch (e) {
        console.error(e);
        const error = e as AxiosError;
        if (error.isAxiosError && error.response?.status === 404) {
          await new Promise((resolve) =>
            globalThis.setTimeout(() => {
              resolve(null);
            }, BACK_OFF_TIME),
          );
        }
        if (retries === MAX_RETRIES) {
          break;
        }
        retries++;
      }
    } while (!database);
    if (!database) {
      throw new Error(`Database ${databaseId} does not exist.`);
    }
    return database;
  }
}

export default NotionDB;

const run = async () => {
  dotenv.config();
  const notionDB = new NotionDB(process.env.NOTION_API_KEY as string);
  const database = await notionDB.getDatabaseRef(
    new NotionUrl(process.env.NOTION_DB_URL as string),
  );
  const pages = await database.pages.getAll(['Receipts', 'test']);
  // console.log('pages', pages);
};

run();
