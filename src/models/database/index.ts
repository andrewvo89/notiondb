import { axios, BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { DatabaseObject, DatabaseResponse } from './types';
import { NotionId, NotionProperty, NotionUrl } from '../notion';
import { Page, User } from '..';
import { PageOptions } from '../page';
import { PropertySchema } from '../../schema';

/**
 * Class representing a Notion Database.
 * @class Database
 */
class Database {
  #id: string;
  #title: string;
  #properties: NotionProperty[];
  #createdTime: globalThis.Date;
  #lastEditedTime: globalThis.Date;

  /**
   * Creates an instance of Database.
   * @param {string} id
   * @param {string} title
   * @param {NotionProperty[]} properties
   * @memberof Database
   */
  constructor(
    id: string,
    title: string,
    properties: NotionProperty[],
    createdTime: globalThis.Date,
    lastEditedTime: globalThis.Date,
  ) {
    this.#id = id;
    this.#title = title;
    this.#properties = properties;
    this.#createdTime = createdTime;
    this.#lastEditedTime = lastEditedTime;
  }

  /**
   * Get the JavaScript object representing the Database.
   * @readonly
   * @type {DatabaseObject}
   * @memberof Database
   */
  get object(): DatabaseObject {
    return {
      id: this.#id,
      title: this.#title,
      createdTime: this.#createdTime,
      lastEditedTime: this.#lastEditedTime,
      properties: this.#properties,
    };
  }

  /**
   * Static Page methods.
   * @readonly
   * @memberof Database
   */
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

  /**
   * Static User methods.
   * @readonly
   * @memberof Database
   */
  get users() {
    return {
      get: User.get,
      getAll: User.getAll,
    };
  }

  /**
   * Gets a Notion Database Reference using a Notion URL or Notion ID.
   * @static
   * @param {(NotionUrl | NotionId)} identifier
   * @return {*}  {Promise<Database>}
   * @memberof Database
   */
  static async get(identifier: NotionUrl | NotionId): Promise<Database> {
    const databaseId = identifier.getId();
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
        database = new Database(
          result.id,
          result.title[0].plain_text,
          properties,
          new globalThis.Date(result.created_time),
          new globalThis.Date(result.last_edited_time),
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

  /**
   * Gets all Notion Database References.
   * @static
   * @return {*}  {Promise<Database[]>}
   * @memberof Database
   */
  static async getAll(): Promise<Database[]> {
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
            result.title[0].plain_text,
            properties,
            new globalThis.Date(result.created_time),
            new globalThis.Date(result.last_edited_time),
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
   * Creates a Database inside a Parent Page using a Property Schema.
   * New Databases cannot be created on the root of a Workspace and must be created in an existing Page.
   * Parent Page must be have block children and not a Database page.
   * It cannot be a Table, Board, List, Calendar, Gallery, Timeline etc.
   * @static
   * @param {(NotionUrl | NotionId)} parentPageIdentifier
   * @param {string} title
   * @param {PropertySchema} schema
   * @return {*}  {Promise<Database>}
   * @memberof Database
   */
  static async create(
    parentPageIdentifier: NotionUrl | NotionId,
    title: string,
    schema: PropertySchema,
  ): Promise<Database> {
    const parentPageId = parentPageIdentifier.getId();
    let retries = 0;
    let database: Database | null = null;
    do {
      try {
        const response = await axios.post('/databases', {
          parent: {
            type: 'page_id',
            page_id: parentPageId,
          },
          title: [
            {
              type: 'text',
              text: {
                content: title,
              },
            },
          ],
          properties: schema.schemaObjects.reduce(
            (prevProperties, schemaObject) => ({
              ...prevProperties,
              ...schemaObject.transformToNotionProperty(),
            }),
            {},
          ),
        });
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
        database = new Database(
          result.id,
          result.title[0].plain_text,
          properties,
          new globalThis.Date(result.created_time),
          new globalThis.Date(result.last_edited_time),
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
      throw new Error(`Database failed to create.`);
    }
    return database;
  }
}

export { Database };
