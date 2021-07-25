import axios from '../../utils/api';
import { PageResponse, Property } from '../notion/types';
import { DatabaseResponse } from './types';

class Database {
  #id: string;
  #title: string;
  #properties: Property[];

  constructor(id: string, title: string, properties: Property[]) {
    this.#id = id;
    this.#title = title;
    this.#properties = properties;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get properties() {
    return this.#properties;
  }

  static async get(databaseId: string): Promise<Database | null> {
    try {
      const response = await axios.get(`/databases/${databaseId}`);
      const databaseProperties: DatabaseResponse = response.data;
      const properties = Object.values(databaseProperties.properties).map(
        (property) =>
          ({
            id: property.id,
            name: property.name,
            type: property.type,
            value: property[property.type],
          } as Property),
      );
      const database = new Database(
        databaseProperties.id,
        databaseProperties.title.plain_text,
        properties,
      );
      return database;
    } catch (e) {
      // console.error(e);
      return null;
    }
  }

  async createPage(
    data: Record<string, any>,
  ): Promise<PageResponse | undefined> {
    try {
      const propertyNames = Object.keys(data);
      const { valid, errors } = validatePropertiesExist(
        propertyNames,
        this.#properties,
      );
      if (!valid) {
        throw new Error(errors.join(', '));
      }
      const properties = transformToNotionProperties(this.#properties, data);
      const response = await axios.post(`/pages`, {
        parent: {
          type: 'database_id',
          database_id: this.#id,
        },
        properties,
      });
      const pageResponse = response.data as PageResponse;
      return pageResponse;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Database;

function validatePropertiesExist(
  propertyNames: string[],
  properties: Property[],
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  for (const name of propertyNames) {
    const propertyExists = properties.some(
      (property) => property.name === name,
    );
    if (!propertyExists) {
      errors.push(`${name} is not a property that exists.`);
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

function transformToNotionProperties(
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
