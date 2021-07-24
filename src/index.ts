import Database from './models/database';
import { DatabaseResponse } from './models/database/types';
import axios, { BACK_OFF_TIME } from './utils/api';
import { PageResponse, Property, PropertyType } from './models/notion/types';
import { AxiosError } from 'axios';
import * as api from './utils/api';
import dotenv from 'dotenv';

class NotionDB {
  #integrationToken: string;
  #databases: Database[];

  constructor(integrationToken: string) {
    this.#integrationToken = integrationToken;
    this.#databases = [];
  }

  get databases() {
    return this.#databases;
  }

  async init() {
    if (!this.#integrationToken) {
      throw new Error('Not integration token provided.');
    }
    axios.defaults.headers.common['Authorization'] = this.#integrationToken;

    // Get databases
    let hasMore: boolean = false;
    let nextCursor: string = '';

    do {
      const nextCursorParam: string = hasMore
        ? `&start_cursor=${nextCursor}`
        : '';
      try {
        const response = await axios.get(
          `/databases?page_size=1${nextCursorParam}`,
        );

        const results = response.data.results as DatabaseResponse[];
        for (const result of results) {
          const properties = Object.values(result.properties).map(
            (property) =>
              ({
                id: property.id,
                name: property.name,
                type: property.type,
                value: property[property.type],
              } as Property),
          );
          const database = new Database(
            result.id,
            result.title.plain_text,
            properties,
          );
          this.#databases.push(database);
        }
        hasMore = response.data['has_more'];
        if (hasMore) {
          nextCursor = response.data['next_cursor'];
        }
      } catch (e) {
        // console.error(e);
        const error = e as AxiosError;
        if (error.isAxiosError && error.response?.status === 404) {
          await new Promise((resolve) =>
            global.setTimeout(() => {
              resolve(null);
            }, BACK_OFF_TIME),
          );
        }
      }
    } while (hasMore);
  }

  async createPage(
    databaseId: string,
    data: Record<string, any>,
  ): Promise<PageResponse | undefined> {
    try {
      if (!this.#integrationToken) {
        throw new Error('Not integration token provided.');
      }
      const database = await Database.get(databaseId);
      if (!database) {
        throw new Error('Failed to communicate with database.');
      }
      const propertyNames = Object.keys(data);
      const { valid, errors } = database.validatePropertiesExist(propertyNames);
      if (!valid) {
        throw new Error(errors.join(', '));
      }
      const properties = this.transformToNotionProperties(
        database.properties,
        data,
      );
      const response = await axios.post(`/pages`, {
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties,
      });
      const pageResponse = response.data as PageResponse;
      return pageResponse;
    } catch (error) {
      console.error(error);
    }
  }

  transformToNotionProperties(
    properties: Property[],
    data: Record<string, any>,
  ): Record<string, any> {
    return Object.entries(data).reduce(
      (notionProperties: Record<string, any>, dataProperty: [string, any]) => {
        const [key, value] = dataProperty;
        const propertyData = properties.find((p) => p.name === key);
        if (!propertyData) {
          return notionProperties;
        }
        switch (propertyData.type) {
          case 'title':
            return {
              ...notionProperties,
              [key]: {
                title: [
                  {
                    type: 'text',
                    text: {
                      content: value,
                    },
                  },
                ],
              },
            };
          case 'number':
            return {
              ...notionProperties,
              [key]: {
                number: data[key],
              },
            };
          default:
            return notionProperties;
        }
      },
      {},
    );
  }
}
