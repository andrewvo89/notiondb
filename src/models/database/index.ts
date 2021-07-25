import { AxiosError } from 'axios';
import axios, { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { PageResponse, Property } from '../notion/types';
import {
  Checkbox,
  Date,
  Email,
  MultiSelect,
  Number,
  PhoneNumber,
  RichText,
  Select,
  Title,
  URL,
} from '../property-data';
import { PropertyData } from '../property-data/types';
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

  async getAllPages(): Promise<Record<string, any>[]> {
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const pages: Record<string, any>[] = [];
    do {
      let retries = 0;
      try {
        const response = await axios.post(`/databases/${this.#id}/query`);
        pages.push(
          ...response.data.results.map(
            (result: Record<string, any>) => result.properties.Receipts.files,
          ),
        );
        hasMore = response.data['has_more'];
        if (hasMore) {
          nextCursor = response.data['next_cursor'];
        }
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
          continue;
        }
        retries++;
      }
    } while (hasMore);
    return pages;
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
      console.log('properties', properties);
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
      const [propertyName, value] = dataProperty;
      const property = properties.find((p) => p.name === propertyName);
      if (!property) {
        return notionProperties;
      }
      let propertyData: PropertyData;
      switch (property.type) {
        case 'title':
          propertyData = value as Title;
          break;
        case 'rich_text':
          propertyData = value as RichText;
          break;
        case 'number':
          propertyData = value as Number;
          break;
        case 'select':
          propertyData = value as Select;
          break;
        case 'multi_select':
          propertyData = value as MultiSelect;
          break;
        case 'date':
          propertyData = value as Date;
          break;
        case 'checkbox':
          propertyData = value as Checkbox;
          break;
        case 'url':
          propertyData = value as URL;
          break;
        case 'email':
          propertyData = value as Email;
          break;
        case 'phone_number':
          propertyData = value as PhoneNumber;
          break;
        default:
          return notionProperties;
      }
      return {
        ...notionProperties,
        [propertyName]: propertyData.notionProperty,
      };
    },
    {},
  );
}
