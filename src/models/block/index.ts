import { axios, BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { BlockObject, BlockResponse, BlockTypes } from '.';
import { NotionId, NotionUrl } from '../notion';

/**
 * Class representing a Block.
 * @class Block
 */
class Block {
  #id: string;
  #type: BlockTypes;
  #createdTime: globalThis.Date;
  #lastEditedTime: globalThis.Date;
  #hasChildren: boolean;
  #data: Record<string, any>;

  /**
   * Creates an instance of Block.
   * @param {string} id
   * @param {BlockTypes} type
   * @param {globalThis.Date} createdTime
   * @param {globalThis.Date} lastEditedTime
   * @param {boolean} hasChildren
   * @param {Record<string, any>} data
   * @memberof Block
   */
  constructor(
    id: string,
    type: BlockTypes,
    createdTime: globalThis.Date,
    lastEditedTime: globalThis.Date,
    hasChildren: boolean,
    data: Record<string, any>,
  ) {
    this.#id = id;
    this.#type = type;
    this.#createdTime = createdTime;
    this.#lastEditedTime = lastEditedTime;
    this.#hasChildren = hasChildren;
    this.#data = data;
  }

  /**
   * Get the JavaScript object representing the Block.
   * @readonly
   * @type {BlockObject}
   * @memberof Block
   */
  get object(): BlockObject {
    return {
      id: this.#id,
      type: this.#type,
      createdTime: this.#createdTime,
      lastEditedTime: this.#lastEditedTime,
      hasChildren: this.#hasChildren,
      data: this.#data,
    };
  }

  /**
   * Gets all Blocks from a parent Block Notion ID or Notion URL.
   * @static
   * @param {(NotionId | NotionUrl)} identifier
   * @return {*}  {Promise<Block[]>}
   * @memberof Block
   */
  static async getAll(identifier: NotionId | NotionUrl): Promise<Block[]> {
    const blockId = identifier.getId();
    const blocks: Block[] = [];
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const nextCursorParam: string = hasMore
      ? `?start_cursor=${nextCursor}`
      : '';
    do {
      let retries = 0;
      try {
        const response = await axios.get(
          `/blocks/${blockId}/children${nextCursorParam}`,
        );
        const results = response.data.results as BlockResponse[];
        blocks.push(
          ...results.map(
            (result: BlockResponse) =>
              new Block(
                result.id,
                result.type,
                new globalThis.Date(result.created_time),
                new globalThis.Date(result.last_edited_time),
                result.has_children,
                result[result.type],
              ),
          ),
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
    return blocks;
  }
}

export { Block };
export * from './types';
