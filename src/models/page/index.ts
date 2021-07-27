import axios, { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import { NotionProperty } from '../notion/types';
import { PageOptions, PageResponse } from './types';
import {
  transformFromNotionProperties,
  transformToNotionProperties,
  validateFilters,
  validatePropertiesExist,
  validateSorts,
} from '../../utils/notion';
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

  static async get(
    identifer: NotionUrl | NotionId,
    excludeProperties?: string[],
  ) {
    const pageId = identifer.getId();
    let retries = 0;
    let page: Page | null = null;
    do {
      try {
        const response = await axios.get(`/pages/${pageId}`);
        const pageResponse = response.data as PageResponse;
        const properties = Object.entries(pageResponse.properties).reduce(
          (prevProperties: Record<string, any>, [propertyName, value]) => {
            if (excludeProperties?.includes(propertyName)) {
              return prevProperties;
            }
            return {
              ...prevProperties,
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
      throw new Error(`Page ${pageId} does not exist.`);
    }
    return page;
  }

  static async getMany(
    databaseId: string,
    notionProperties: NotionProperty[],
    options: PageOptions,
  ) {
    if (!options.filter && !options.sorts) {
      throw new Error('Must supply at least one Filter or Sort condition.');
    }
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const pages: Record<string, any>[] = [];
    do {
      let retries = 0;
      try {
        const bodyParams: {
          filter?: Record<string, any>;
          sorts?: Record<string, any>;
          start_cursor?: string;
        } = {};
        if (options.filter) {
          const { valid, errors } = validateFilters(
            options.filter,
            notionProperties,
          );
          if (!valid) {
            throw new Error(errors.join(', '));
          }
          bodyParams.filter = options.filter.transformToNotionFilter();
        }
        if (options.sorts) {
          const { valid, errors } = validateSorts(
            options.sorts,
            notionProperties,
          );
          if (!valid) {
            throw new Error(errors.join(', '));
          }
          bodyParams.sorts = options.sorts.map((sort) =>
            sort.transformToNotionSort(),
          );
        }
        if (hasMore) {
          bodyParams.start_cursor = nextCursor;
        }
        const response = await axios.post(
          `/databases/${databaseId}/query`,
          bodyParams,
        );
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }

        const pageProperties = results.map((pageResponse: PageResponse) => {
          const properties = Object.entries(pageResponse.properties).reduce(
            (prevProperties: Record<string, any>, [propertyName, value]) => {
              if (options?.excludeProperties?.includes(propertyName)) {
                return prevProperties;
              }
              return {
                ...prevProperties,
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
    return pages;
  }

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
        const bodyParams: { start_cursor?: string } = {};
        if (hasMore) {
          bodyParams.start_cursor = nextCursor;
        }
        const response = await axios.post(
          `/databases/${databaseId}/query`,
          bodyParams,
        );
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }

        const pageProperties = results.map((pageResponse: PageResponse) => {
          const properties = Object.entries(pageResponse.properties).reduce(
            (prevProperties: Record<string, any>, [propertyName, value]) => {
              if (excludeProperties?.includes(propertyName)) {
                return prevProperties;
              }
              return {
                ...prevProperties,
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
          (prevProperties: Record<string, any>, [propertyName, value]) => {
            return {
              ...prevProperties,
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
        if (!error.isAxiosError) {
          throw new Error(error);
        }
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

  // update() {}

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
        (prevProperties: Record<string, any>, [propertyName, value]) => {
          return {
            ...prevProperties,
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
