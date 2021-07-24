import axios from '../../utils/api';
import { Property } from '../notion/types';
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

  validatePropertiesExist(propertyNames: string[]): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    for (const name of propertyNames) {
      if (!this.propertyExists(name)) {
        errors.push(`${name} is not a property that exists.`);
      }
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  propertyExists(name: string) {
    return this.#properties.some((property) => property.name === name);
  }
}

export default Database;
