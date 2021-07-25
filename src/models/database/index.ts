import { AxiosError } from 'axios';
import axios, { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import {
  PageResponse,
  NotionProperty,
  NotionPropertyData,
} from '../notion/types';
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

class Database {
  #id: string;
  #title: string;
  #properties: NotionProperty[];

  constructor(id: string, title: string, properties: NotionProperty[]) {
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

  get pages() {
    return {
      getAll: (excludeProperties?: string[]) =>
        getAllPages(this.#id, excludeProperties),
    };
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
        [propertyName]: propertyData.notionValue,
      };
    },
    {},
  );
}

async function getAllPages(
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
      pages.push(
        ...results.map((result: PageResponse) =>
          Object.entries(result.properties).reduce(
            (properties, [propertyName, value]) => {
              if (excludeProperties?.includes(propertyName)) {
                return properties;
              }
              return {
                ...properties,
                [propertyName]: transformFromNotionProperties(value),
              };
            },
            {},
          ),
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
