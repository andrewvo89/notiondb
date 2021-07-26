import Database from './models/database';
import { DatabaseResponse } from './models/database/types';
import axios, { BACK_OFF_TIME, MAX_RETRIES } from './utils/api';
import { NotionProperty } from './models/notion/types';
import dotenv from 'dotenv';
import NotionUrl from './models/notion/notion-url';
import NotionId from './models/notion/notion-id';
import { NotionUrlTypes } from './models/notion/notion-url/types';

class NotionDB {
  constructor(integrationToken: string) {
    axios.defaults.headers.common.Authorization = integrationToken;
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
        hasMore = response.data.has_more;
        if (hasMore) {
          nextCursor = response.data.next_cursor;
        }
      } catch (error) {
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

  async getDatabaseRef(identifer: NotionUrl | NotionId): Promise<Database> {
    const databaseId = identifer.getId();
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

const run = async () => {
  dotenv.config();
  const notionDB = new NotionDB(process.env.NOTION_API_KEY as string);
  const database = await notionDB.getDatabaseRef(
    new NotionUrl(process.env.NOTION_DB_URL as string, NotionUrlTypes.DATABASE),
  );
  const page = await database.pages.get(
    new NotionUrl(process.env.NOTION_PAGE_URL as string, NotionUrlTypes.PAGE),
  );
  // const pages = await database.pages.getAll();
  // const createdPage = await database.pages.create({
  //   Name: 'hello delete me right away, then restore me',
  // });
  // const deletedPage = await createdPage.delete();
  // const restoredPage = await deletedPage.restore();
};

run();
