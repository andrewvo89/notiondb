import { LastEditedTimeNotionValue } from '.';
import dayjs from 'dayjs';

/**
 * Class representing a LastEditedTime Notion type.
 * @class LastEditedTime
 * @implements {PropertyInterface}
 */
class LastEditedTime {
  #value: globalThis.Date;

  /**
   * Creates an instance of LastEditedTime.
   * @param {globalThis.LastEditedTime} value
   * @param {DateOptions} [options]
   * @memberof LastEditedTime
   */
  constructor(value: globalThis.Date) {
    this.#value = value;
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {DateNotionValue} notionValue
   * @return {*}  {DateFriendlyValue}
   * @memberof LastEditedTime
   */
  static getValue(notionValue: LastEditedTimeNotionValue): globalThis.Date {
    return dayjs(notionValue.last_edited_time).toDate();
  }
}

export { LastEditedTime };
export * from './types';
