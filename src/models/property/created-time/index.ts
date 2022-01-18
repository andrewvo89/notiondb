import { CreatedTimeNotionValue } from '.';
import dayjs from 'dayjs';

/**
 * Class representing a CreatedTime Notion type.
 * @class CreatedTime
 * @implements {PropertyInterface}
 */
class CreatedTime {
  #value: globalThis.Date;

  /**
   * Creates an instance of CreatedTime.
   * @param {globalThis.CreatedTime} value
   * @param {DateOptions} [options]
   * @memberof CreatedTime
   */
  constructor(value: globalThis.Date) {
    this.#value = value;
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {DateNotionValue} notionValue
   * @return {*}  {DateFriendlyValue}
   * @memberof CreatedTime
   */
  static getValue(notionValue: CreatedTimeNotionValue): globalThis.Date {
    return dayjs(notionValue.created_time).toDate();
  }
}

export { CreatedTime };
export * from './types';
