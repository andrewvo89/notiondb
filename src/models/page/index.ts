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
  #notionProperties: NotionProperty[];
  #properties: Record<string, any>;
  #archived: boolean;
  #createdTime: globalThis.Date;
  #lastEditedTime: globalThis.Date;

  constructor(
    id: string,
    url: string,
    notionProperties: NotionProperty[],
    properties: Record<string, any>,
    archived: boolean,
    createdTime: globalThis.Date,
    lastEditedTime: globalThis.Date,
  ) {
    this.#id = id;
    this.#url = url;
    this.#notionProperties = notionProperties;
    this.#properties = properties;
    this.#archived = archived;
    this.#createdTime = createdTime;
    this.#lastEditedTime = lastEditedTime;
  }

  get properties() {
    return this.#properties;
  }

  get archived() {
    return this.#archived;
  }

  get object() {
    return {
      id: this.#id,
      url: this.#url,
      archived: this.#archived,
      properties: this.#properties,
      createdTime: this.#createdTime,
      lastEditedTime: this.#lastEditedTime,
    };
  }

  static async get(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    excludeProperties?: string[],
  ): Promise<Page> {
    const pageId = identifier.getId();
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
          notionProperties,
          properties,
          pageResponse.archived,
          new globalThis.Date(pageResponse.created_time),
          new globalThis.Date(pageResponse.last_edited_time),
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
    excludeProperties?: string[],
  ): Promise<Page[]> {
    if (!options.filter && !options.sorts) {
      throw new Error('Must supply at least one Filter or Sort condition.');
    }
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const pages: Page[] = [];
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
        pages.push(
          ...results.map((pageResponse: PageResponse) => {
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
              notionProperties,
              properties,
              pageResponse.archived,
              new globalThis.Date(pageResponse.created_time),
              new globalThis.Date(pageResponse.last_edited_time),
            );
            return page;
          }),
        );
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
    notionProperties: NotionProperty[],
    excludeProperties?: string[],
  ): Promise<Page[]> {
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const pages: Page[] = [];
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
        pages.push(
          ...results.map((pageResponse: PageResponse) => {
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
              notionProperties,
              properties,
              pageResponse.archived,
              new globalThis.Date(pageResponse.created_time),
              new globalThis.Date(pageResponse.last_edited_time),
            );
            return page;
          }),
        );
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
          notionProperties,
          properties,
          pageResponse.archived,
          new globalThis.Date(pageResponse.created_time),
          new globalThis.Date(pageResponse.last_edited_time),
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

  async update(data: Record<string, any>): Promise<Page> {
    return update(this.#notionProperties, this.#id, data);
  }

  static update(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    data: Record<string, any>,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return update(notionProperties, pageId, data);
  }

  async delete(): Promise<Page> {
    if (this.#archived) {
      throw new Error(`Page ${this.#id} has already been deleted.`);
    }
    return await setArchived(this.#notionProperties, this.#id, true);
  }

  static delete(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, true);
  }

  async restore(): Promise<Page> {
    if (!this.#archived) {
      throw new Error(`Page ${this.#id} is already active.`);
    }
    return await setArchived(this.#notionProperties, this.#id, false);
  }

  static async restore(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, false);
  }
}

export default Page;

async function update(
  notionProperties: NotionProperty[],
  pageId: string,
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
      const response = await axios.patch(`/pages/${pageId}`, {
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
        notionProperties,
        properties,
        pageResponse.archived,
        new globalThis.Date(pageResponse.created_time),
        new globalThis.Date(pageResponse.last_edited_time),
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
    throw new Error(`Page ${pageId} failed to update.`);
  }
  return page;
}

async function setArchived(
  notionProperties: NotionProperty[],
  pageId: string,
  archived: boolean,
) {
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
        notionProperties,
        properties,
        pageResponse.archived,
        new globalThis.Date(pageResponse.created_time),
        new globalThis.Date(pageResponse.last_edited_time),
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
