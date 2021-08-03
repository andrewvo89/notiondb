import { AxiosInstance } from 'axios';
import { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { Block } from '..';
import { NotionId, NotionProperty, NotionUrl } from '..';
import { PageObject, PageOptions, PageResponse } from '.';
import { PropertyData } from './types';
import {
  transformFromNotionProperties,
  transformToNotionProperties,
  validateFilters,
  validatePropertiesExist,
  validateSorts,
} from '../../utils/notion';

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
  #axiosInstance: AxiosInstance;

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
   * @param {AxiosInstance} axiosInstance
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
    axiosInstance: AxiosInstance,
  ) {
    this.#id = id;
    this.#title = title;
    this.#url = url;
    this.#notionProperties = notionProperties;
    this.#properties = properties;
    this.#archived = archived;
    this.#createdTime = createdTime;
    this.#lastEditedTime = lastEditedTime;
    this.#axiosInstance = axiosInstance;
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
      getAll: () => Block.getAll(new NotionId(this.#id), this.#axiosInstance),
    };
  }

  /**
   * Get the Page using a Notion URL or Notion ID.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {AxiosInstance} axiosInstance
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static async get(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    axiosInstance: AxiosInstance,
    excludeProperties?: string[],
  ): Promise<Page> {
    const pageId = identifier.getId();
    let retries = 0;
    let page: Page | null = null;
    do {
      try {
        const response = await axiosInstance.get(`/pages/${pageId}`);
        const result = response.data as PageResponse;
        let title: string = '';
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
          axiosInstance,
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
   * @param {AxiosInstance} axiosInstance
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page[]>}
   * @memberof Page
   */
  static async getMany(
    databaseId: string,
    notionProperties: NotionProperty[],
    options: PageOptions,
    axiosInstance: AxiosInstance,
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
        const response = await axiosInstance.post(
          `/databases/${databaseId}/query`,
          bodyParams,
        );
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }
        pages.push(
          ...results.map((result: PageResponse) => {
            let title: string = '';
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
              axiosInstance,
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

  /**
   * Get all Pages from the Database.
   * @static
   * @param {string} databaseId
   * @param {NotionProperty[]} notionProperties
   * @param {AxiosInstance} axiosInstance
   * @param {string[]} [excludeProperties]
   * @return {*}  {Promise<Page[]>}
   * @memberof Page
   */
  static async getAll(
    databaseId: string,
    notionProperties: NotionProperty[],
    axiosInstance: AxiosInstance,
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
        const response = await axiosInstance.post(
          `/databases/${databaseId}/query`,
          bodyParams,
        );
        const results = response.data.results as PageResponse[];
        if (results.length === 0) {
          continue;
        }
        pages.push(
          ...results.map((result: PageResponse) => {
            let title: string = '';
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
              axiosInstance,
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
    axiosInstance: AxiosInstance,
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
        const response = await axiosInstance.post(`/pages`, {
          parent: {
            type: 'database_id',
            database_id: databaseId,
          },
          properties: transformToNotionProperties(notionProperties, data),
        });
        const result = response.data as PageResponse;
        let title: string = '';
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
          axiosInstance,
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

  /**
   * Updates the current Page.
   * @param {Record<string, PropertyData>} data
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async update(
    data: Record<string, PropertyData>,
    axiosInstance: AxiosInstance,
  ): Promise<Page> {
    return update(this.#notionProperties, this.#id, data, axiosInstance);
  }

  /**
   * Updates a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {Record<string, PropertyData>} data
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static update(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    data: Record<string, PropertyData>,
    axiosInstance: AxiosInstance,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return update(notionProperties, pageId, data, axiosInstance);
  }

  /**
   * Deletes (archives) the current Page.
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async delete(axiosInstance: AxiosInstance): Promise<Page> {
    if (this.#archived) {
      throw new Error(`Page ${this.#id} has already been deleted.`);
    }
    return await setArchived(
      this.#notionProperties,
      this.#id,
      true,
      axiosInstance,
    );
  }

  /**
   * Deletes (archives) a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static delete(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    axiosInstance: AxiosInstance,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, true, axiosInstance);
  }

  /**
   * Restores (unarchives) the current Page.
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  async restore(axiosInstance: AxiosInstance): Promise<Page> {
    if (!this.#archived) {
      throw new Error(`Page ${this.#id} is already active.`);
    }
    return await setArchived(
      this.#notionProperties,
      this.#id,
      false,
      axiosInstance,
    );
  }

  /**
   * Restores (unarchives) a Page using a Notion URL or Notion ID as the identifier.
   * @static
   * @param {NotionProperty[]} notionProperties
   * @param {(NotionUrl | NotionId)} identifier
   * @param {AxiosInstance} axiosInstance
   * @return {*}  {Promise<Page>}
   * @memberof Page
   */
  static async restore(
    notionProperties: NotionProperty[],
    identifier: NotionUrl | NotionId,
    axiosInstance: AxiosInstance,
  ): Promise<Page> {
    const pageId = identifier.getId();
    return setArchived(notionProperties, pageId, false, axiosInstance);
  }
}
/**
 * Updates a a Page using it's Page ID.
 * @param {NotionProperty[]} notionProperties
 * @param {string} pageId
 * @param {Record<string, PropertyData>} data
 * @param {AxiosInstance} axiosInstance
 * @return {*}  {Promise<Page>}
 */
async function update(
  notionProperties: NotionProperty[],
  pageId: string,
  data: Record<string, PropertyData>,
  axiosInstance: AxiosInstance,
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
      const response = await axiosInstance.patch(`/pages/${pageId}`, {
        properties: transformToNotionProperties(notionProperties, data),
      });
      const result = response.data as PageResponse;
      let title: string = '';
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
        axiosInstance,
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

/**
 * Archives or unarchives a Page using its Page ID.
 * @param {NotionProperty[]} notionProperties
 * @param {string} pageId
 * @param {boolean} archived
 * @param {AxiosInstance} axiosInstance
 * @return {*}  {Promise<Page>}
 */
async function setArchived(
  notionProperties: NotionProperty[],
  pageId: string,
  archived: boolean,
  axiosInstance: AxiosInstance,
): Promise<Page> {
  let retries = 0;
  let page: Page | null = null;
  do {
    try {
      const response = await axiosInstance.patch(`/pages/${pageId}`, {
        archived,
      });
      const result = response.data as PageResponse;
      let title: string = '';
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
        axiosInstance,
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
