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
import { NotionProperty, NotionPropertyData } from '../notion/types';
import { PropertyData } from '../property-data/types';
class Page {
  #id: string;
  #url: string;
  #properties: Record<string, any>;
  #archived: boolean;

  constructor(
    id: string,
    url: string,
    properties: Record<string, any>,
    archived: boolean,
  ) {
    this.#id = id;
    this.#url = url;
    this.#properties = properties;
    this.#archived = archived;
  }

  get properties() {
    return this.#properties;
  }

  get archived() {
    return this.#archived;
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

        const pageProperties = results.map((pageResponse: PageResponse) => {
          const properties = Object.entries(pageResponse.properties).reduce(
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
          const page = new Page(
            pageResponse.id,
            pageResponse.url,
            properties,
            pageResponse.archived,
          );
          return page.properties;
        });
        pages.push(...pageProperties);
        hasMore = response.data['has_more'];
        if (hasMore) {
          nextCursor = response.data['next_cursor'];
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
    return pages;
  }

  static async create(
    databaseId: string,
    notionProperties: NotionProperty[],
    data: Record<string, any>,
  ): Promise<Page> {
    let retries = 0;
    const propertyNames = Object.keys(data);
    const { valid, errors } = validatePropertiesExist(
      propertyNames,
      notionProperties,
    );
    if (!valid) {
      throw new Error(errors.join(', '));
    }

    let page: Page | null = null;
    do {
      try {
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
        page = new Page(
          pageResponse.id,
          pageResponse.url,
          properties,
          pageResponse.archived,
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
    } while (!page);
    if (!page) {
      throw new Error(`Page failed to create.`);
    }
    return page;
  }

  update() {}

  async restore(): Promise<Page> {
    if (!this.#archived) {
      throw new Error(`Page ${this.#id} is already active.`);
    }
    return await setArchived(this.#id, false);
  }

  async delete(): Promise<Page> {
    if (this.#archived) {
      throw new Error(`Page ${this.#id} has already been deleted.`);
    }
    return await setArchived(this.#id, true);
  }
}

export default Page;

async function setArchived(pageId: string, archived: boolean) {
  let retries = 0;
  let page: Page | null = null;
  do {
    try {
      const response = await axios.patch(`/pages/${pageId}`, {
        archived,
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
      page = new Page(
        pageResponse.id,
        pageResponse.url,
        properties,
        pageResponse.archived,
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
  } while (!page);
  if (!page) {
    const action = archived ? 'delete' : 'restore';
    throw new Error(`Page ${pageId} failed to ${action}.`);
  }
  return page;
}

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
