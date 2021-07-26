import axios, { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { PageResponse } from './types';
import {
  Checkbox,
  Date,
  Email,
  MultiSelect,
  Number,
  People,
  PhoneNumber,
  RichText,
  Select,
  Title,
  URL,
} from '../property-data';
import { AxiosError } from 'axios';
import { NotionProperty, NotionPropertyData } from '../notion/types';
import { User } from '../user';
import { UserResponse } from '../user/types';
import { PropertyData } from '../property-data/types';
class Page {
  #id: string;
  #url: string;
  #properties: Record<string, any>;

  constructor(id: string, url: string, properties: Record<string, any>) {
    this.#id = id;
    this.#url = url;
    this.#properties = properties;
  }

  get properties() {
    return this.#properties;
  }

  static async get() {}

  static async getAll(
    databaseId: string,
    excludeProperties?: string[],
  ): Promise<Record<string, any>[]> {
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const pages: Record<string, any>[] = [];
    do {
      let retries = 0;
      try {
        const nextCursorParam: string = hasMore
          ? `?start_cursor=${nextCursor}`
          : '';
        const response = await axios.post(
          `/databases/${databaseId}/query${nextCursorParam}`,
        );
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }

        const pageProperties = results.map((result: PageResponse) => {
          const properties = Object.entries(result.properties).reduce(
            (properties: Record<string, any>, [propertyName, value]) => {
              if (excludeProperties?.includes(propertyName)) {
                return properties;
              }
              return {
                ...properties,
                [propertyName]: transformFromNotionProperties(value),
              };
            },
            {},
          );
          const page = new Page(result.id, result.url, properties);
          return page.properties;
        });
        pages.push(...pageProperties);
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

  static async create(
    databaseId: string,
    notionProperties: NotionProperty[],
    data: Record<string, any>,
  ): Promise<Page> {
    try {
      const propertyNames = Object.keys(data);
      const { valid, errors } = validatePropertiesExist(
        propertyNames,
        notionProperties,
      );
      if (!valid) {
        throw new Error(errors.join(', '));
      }
      const response = await axios.post(`/pages`, {
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties: transformToNotionProperties(notionProperties, data),
      });
      const pageResponse = response.data as PageResponse;
      const properties = Object.entries(pageResponse.properties).reduce(
        (properties: Record<string, any>, [propertyName, value]) => {
          return {
            ...properties,
            [propertyName]: transformFromNotionProperties(value),
          };
        },
        {},
      );
      return new Page(pageResponse.id, pageResponse.url, properties);
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  update() {}
}

export default Page;

function validatePropertiesExist(
  propertyNames: string[],
  properties: NotionProperty[],
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
  properties: NotionProperty[],
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
          propertyData = new Title(value);
          break;
        case 'rich_text':
          propertyData = new RichText(value);
          break;
        case 'number':
          propertyData = new Number(value);
          break;
        case 'select':
          propertyData = new Select(value);
          break;
        case 'multi_select':
          propertyData = new MultiSelect(value);
          break;
        case 'date':
          propertyData = new Date(value);
          break;
        case 'checkbox':
          propertyData = new Checkbox(value);
          break;
        case 'url':
          propertyData = new URL(value);
          break;
        case 'email':
          propertyData = new Email(value);
          break;
        case 'phone_number':
          propertyData = new PhoneNumber(value);
          break;
        default:
          return notionProperties;
      }
      return {
        ...notionProperties,
        [propertyName]: propertyData.notionValue,
      };
    },
    {},
  );
}

function transformFromNotionProperties(propertyData: NotionPropertyData): any {
  const data = propertyData[propertyData.type];
  switch (propertyData.type) {
    case 'title':
      return Title.getValue({ title: data });
    case 'rich_text':
      return RichText.getValue({ rich_text: data });
    case 'number':
      return Number.getValue({ number: data });
    case 'select':
      return Select.getValue({ select: data });
    case 'multi_select':
      return MultiSelect.getValue({ multi_select: data });
    case 'date':
      return Date.getValue({ date: data });
    case 'checkbox':
      return Checkbox.getValue({ checkbox: data });
    case 'url':
      return URL.getValue({ url: data });
    case 'email':
      return Email.getValue({ email: data });
    case 'phone_number':
      return PhoneNumber.getValue({ phone_number: data });
    case 'people':
      return People.getValue({ people: data });
    case 'formula': {
      const type = propertyData.formula.type;
      return transformFromNotionProperties({
        id: propertyData.id,
        type: type,
        [type]: propertyData.formula[type],
      });
    }
    default:
      return undefined;
  }
}
