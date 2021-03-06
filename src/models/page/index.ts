import { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { Block, NotionId, NotionProperty, NotionUrl } from '..';
import { PageObject, PageOptions, PageResponse } from '.';
import {
  transformFromNotionProperties,
  transformToNotionProperties,
  validateFilters,
  validatePropertiesExist,
  validateSorts,
} from '../../utils/notion';

import { PropertyData } from './types';
import { getAxiosInstance } from '../../axios';

/**
 * Class representing a Notion Page.
 * @class Page
 */
class Page {
  #id: string;
  #title: string;
  #url: string;
  #notionProperties: NotionProperty[];
  #properties: Record<string, any>;
  #archived: boolean;
  #createdTime: globalThis.Date;
  #lastEditedTime: globalThis.Date;

  /**
   * Creates an instance of Page.
   * @param {string} id
   * @param {string} title
   * @param {string} url
   * @param {NotionProperty[]} notionProperties
   * @param {Record<string, any>} properties
   * @param {boolean} archived
   * @param {globalThis.Date} createdTime
   * @param {globalThis.Date} lastEditedTime
   * @memberof Page
   */
  constructor(
    id: string,
    title: string,
    url: string,
    notionProperties: NotionProperty[],
    properties: Record<string, any>,
    archived: boolean,
    createdTime: globalThis.Date,
    lastEditedTime: globalThis.Date,
  ) {
    this.#id = id;
    this.#title = title;
    this.#url = url;
    this.#notionProperties = notionProperties;
    this.#properties = properties;
    this.#archived = archived;
    this.#createdTime = createdTime;
    this.#lastEditedTime = lastEditedTime;
  }

  /**
   * Get the JavaScript object representing the Page.
   * @readonly
   * @type {PageObject}
   * @memberof Page
   */
  get object(): PageObject {
    return {
      id: this.#id,
      title: this.#title,
      url: this.#url,
      archived: this.#archived,
      createdTime: this.#createdTime,
      lastEditedTime: this.#lastEditedTime,
      properties: this.#properties,
    };
  }

  /**
   * Gets access to children Blocks.
   * @readonly
   * @memberof Page
   */
  get blocks() {
    return {
      getAll: () => Block.getAll(new NotionId(this.#id)),
    };
  }

  /**
   * Get the Page using a Notion URL or Notion ID.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static async get(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    excludeProperties?: string[],
  ): Promise<Page> {
    const axiosInstance = getAxiosInstance();
    const pageId = identifier.getId();
    let retries = 0;
    let page: Page | null = null;
    do {
      try {
        const response = await axiosInstance.get(`/pages/${pageId}`);
        const result = response.data as PageResponse;
        let title = '';
        const properties = Object.entries(result.properties).reduce(
          (prevProperties: Record<string, any>, [propertyName, value]) => {
            if (excludeProperties?.includes(propertyName)) {
              return prevProperties;
            }
            if (value.type === 'title') {
              title = transformFromNotionProperties(value);
            }
            return {
              ...prevProperties,
              [propertyName]: transformFromNotionProperties(value),
            };
          },
          {},
        );
        page = new Page(
          result.id,
          title,
          result.url,
          notionProperties,
          properties,
          result.archived,
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
    } while (!page);
    if (!page) {
      throw new Error(`Page ${pageId} does not exist.`);
    }
    return page;
  }

  /**
   * Get many Pages with Filter and Sort logic.
   * @static
   * @param {string} databaseId
   * @param {NotionProperty[]} notionProperties
   * @param {PageOptions} options
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page[]>}
   * @memberof Page
   */
  static async getMany(
    databaseId: string,
    notionProperties: NotionProperty[],
    options: PageOptions,
    excludeProperties?: string[],
  ): Promise<Page[]> {
    const axiosInstance = getAxiosInstance();
    if (!options.filter && !options.sorts) {
      throw new Error('Must supply at least one Filter or Sort condition.');
    }
    let hasMore = false;
    let nextCursor = '';
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
          const { valid, errors } = validateFilters(options.filter, notionProperties);
          if (!valid) {
            throw new Error(errors.join(', '));
          }
          bodyParams.filter = options.filter.transformToNotionFilter();
        }
        if (options.sorts) {
          const { valid, errors } = validateSorts(options.sorts, notionProperties);
          if (!valid) {
            throw new Error(errors.join(', '));
          }
          bodyParams.sorts = options.sorts.map((sort) => sort.transformToNotionSort());
        }
        if (hasMore) {
          bodyParams.start_cursor = nextCursor;
        }
        const response = await axiosInstance.post(`/databases/${databaseId}/query`, bodyParams);
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }
        pages.push(
          ...results.map((result: PageResponse) => {
            let title = '';
            const properties = Object.entries(result.properties).reduce(
              (prevProperties: Record<string, any>, [propertyName, value]) => {
                if (value.type === 'title') {
                  title = transformFromNotionProperties(value);
                }
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
              result.id,
              title,
              result.url,
              notionProperties,
              properties,
              result.archived,
              new globalThis.Date(result.created_time),
              new globalThis.Date(result.last_edited_time),
            );
            return page;
          }),
        );
        hasMore = response.data.has_more;
        if (hasMore) {
          nextCursor = response.data.next_cursor;
        }
      } catch (error) {
        // @ts-ignore
        if (!error.isAxiosError) {
          // @ts-ignore
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

  /**
   * Get all Pages from the Database.
   * @static
   * @param {string} databaseId
   * @param {NotionProperty[]} notionProperties
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page[]>}
   * @memberof Page
   */
  static async getAll(
    databaseId: string,
    notionProperties: NotionProperty[],
    excludeProperties?: string[],
  ): Promise<Page[]> {
    const axiosInstance = getAxiosInstance();
    let hasMore = false;
    let nextCursor = '';
    const pages: Page[] = [];
    do {
      let retries = 0;
      try {
        const bodyParams: { start_cursor?: string } = {};
        if (hasMore) {
          bodyParams.start_cursor = nextCursor;
        }
        const response = await axiosInstance.post(`/databases/${databaseId}/query`, bodyParams);
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }
        pages.push(
          ...results.map((result: PageResponse) => {
            let title = '';
            const properties = Object.entries(result.properties).reduce(
              (prevProperties: Record<string, any>, [propertyName, value]) => {
                if (value.type === 'title') {
                  title = transformFromNotionProperties(value);
                }
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
              result.id,
              title,
              result.url,
              notionProperties,
              properties,
              result.archived,
              new globalThis.Date(result.created_time),
              new globalThis.Date(result.last_edited_time),
            );
            return page;
          }),
        );
        hasMore = response.data.has_more;
        if (hasMore) {
          nextCursor = response.data.next_cursor;
        }
      } catch (error) {
        // @ts-ignore
        if (!error.isAxiosError) {
          // @ts-ignore
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

  /**
   * Creates a Page.
   * @static
   * @param {string} databaseId
   * @param {NotionProperty[]} notionProperties
   * @param {Record<string, PropertyData>} data
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static async create(
    databaseId: string,
    notionProperties: NotionProperty[],
    data: Record<string, PropertyData>,
  ): Promise<Page> {
    const axiosInstance = getAxiosInstance();
    let retries = 0;
    const propertyNames = Object.keys(data);
    const { valid, errors } = validatePropertiesExist(propertyNames, notionProperties);
    if (!valid) {
      throw new Error(errors.join(', '));
    }

    let page: Page | null = null;
    do {
      try {
        const response = await axiosInstance.post(`/pages`, {
          parent: {
            type: 'database_id',
            database_id: databaseId,
          },
          properties: transformToNotionProperties(notionProperties, data),
        });
        const result = response.data as PageResponse;
        let title = '';
        const properties = Object.entries(result.properties).reduce(
          (prevProperties: Record<string, any>, [propertyName, value]) => {
            if (value.type === 'title') {
              title = transformFromNotionProperties(value);
            }
            return {
              ...prevProperties,
              [propertyName]: transformFromNotionProperties(value),
            };
          },
          {},
        );
        page = new Page(
          result.id,
          title,
          result.url,
          notionProperties,
          properties,
          result.archived,
          new globalThis.Date(result.created_time),
          new globalThis.Date(result.last_edited_time),
        );
      } catch (error) {
        // @ts-ignore
        if (!error.isAxiosError) {
          // @ts-ignore
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

  /**
   * Updates the current Page.
   * @param {Record<string, PropertyData>} data
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async update(data: Record<string, PropertyData>): Promise<Page> {
    return update(this.#notionProperties, this.#id, data);
  }

  /**
   * Updates a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {Record<string, PropertyData>} data
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static update(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    data: Record<string, PropertyData>,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return update(notionProperties, pageId, data);
  }

  /**
   * Deletes (archives) the current Page.
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async delete(): Promise<Page> {
    if (this.#archived) {
      throw new Error(`Page ${this.#id} has already been deleted.`);
    }
    return await setArchived(this.#notionProperties, this.#id, true);
  }

  /**
   * Deletes (archives) a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static delete(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, true);
  }

  /**
   * Restores (unarchives) the current Page.
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async restore(): Promise<Page> {
    if (!this.#archived) {
      throw new Error(`Page ${this.#id} is already active.`);
    }
    return await setArchived(this.#notionProperties, this.#id, false);
  }

  /**
   * Restores (unarchives) a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static async restore(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, false);
  }
}
/**
 * Updates a a Page using it's Page ID.
 * @param {NotionProperty[]} notionProperties
 * @param {string} pageId
 * @param {Record<string, PropertyData>} data
 * @return {*}  {Promise<Page>}
 */
async function update(
  notionProperties: NotionProperty[],
  pageId: string,
  data: Record<string, PropertyData>,
): Promise<Page> {
  const axiosInstance = getAxiosInstance();
  let retries = 0;
  const propertyNames = Object.keys(data);
  const { valid, errors } = validatePropertiesExist(propertyNames, notionProperties);
  if (!valid) {
    throw new Error(errors.join(', '));
  }

  let page: Page | null = null;
  do {
    try {
      const response = await axiosInstance.patch(`/pages/${pageId}`, {
        properties: transformToNotionProperties(notionProperties, data),
      });
      const result = response.data as PageResponse;
      let title = '';
      const properties = Object.entries(result.properties).reduce(
        (prevProperties: Record<string, any>, [propertyName, value]) => {
          if (value.type === 'title') {
            title = transformFromNotionProperties(value);
          }
          return {
            ...prevProperties,
            [propertyName]: transformFromNotionProperties(value),
          };
        },
        {},
      );
      page = new Page(
        result.id,
        title,
        result.url,
        notionProperties,
        properties,
        result.archived,
        new globalThis.Date(result.created_time),
        new globalThis.Date(result.last_edited_time),
      );
    } catch (error) {
      // @ts-ignore
      if (!error.isAxiosError) {
        // @ts-ignore
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

/**
 * Archives or unarchives a Page using its Page ID.
 * @param {NotionProperty[]} notionProperties
 * @param {string} pageId
 * @param {boolean} archived
 * @return {*}  {Promise<Page>}
 */
async function setArchived(notionProperties: NotionProperty[], pageId: string, archived: boolean): Promise<Page> {
  const axiosInstance = getAxiosInstance();
  let retries = 0;
  let page: Page | null = null;
  do {
    try {
      const response = await axiosInstance.patch(`/pages/${pageId}`, {
        archived,
      });
      const result = response.data as PageResponse;
      let title = '';
      const properties = Object.entries(result.properties).reduce(
        (prevProperties: Record<string, any>, [propertyName, value]) => {
          if (value.type === 'title') {
            title = transformFromNotionProperties(value);
          }
          return {
            ...prevProperties,
            [propertyName]: transformFromNotionProperties(value),
          };
        },
        {},
      );
      page = new Page(
        result.id,
        title,
        result.url,
        notionProperties,
        properties,
        result.archived,
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
  } while (!page);
  if (!page) {
    const action = archived ? 'delete' : 'restore';
    throw new Error(`Page ${pageId} failed to ${action}.`);
  }
  return page;
}

export { Page };
export * from './types';
