import { DateFriendlyValue, DateNotionValue, DateOptions } from '.';

import { PropertyInterface } from '..';
import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

/**
 * Class representing a Date Notion type.
 * @class Date
 * @implements {PropertyInterface}
 */
class Date implements PropertyInterface {
  #start: globalThis.Date;
  #options?: DateOptions;

  /**
   * Creates an instance of Date.
   * @param {globalThis.Date} start
   * @param {DateOptions} [options]
   * @memberof Date
   */
  constructor(start: globalThis.Date, options?: DateOptions) {
    this.#start = start;
    this.#options = options;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @type {DateNotionValue}
   * @memberof Date
   */
  get notionValue(): DateNotionValue {
    const dateProperties: {
      start: string;
      end?: string;
    } = {
      start: dayjs(this.#start).format('YYYY-MM-DD'),
    };
    if (this.#options) {
      const { end, includeTime, timezone } = this.#options;
      if (end) {
        dateProperties.end = dayjs(end).format('YYYY-MM-DD');
      }
      if (timezone) {
        dateProperties.start = dayjs.tz(this.#start, timezone).format('YYYY-MM-DD');
        if (end) {
          dateProperties.end = dayjs.tz(end, timezone).format('YYYY-MM-DD');
        }
      }
      if (includeTime) {
        const startIsoString = dayjs.tz(this.#start, timezone).toISOString();
        if (timezone) {
          const offset = dayjs.tz(this.#start, timezone).utcOffset() / 60;
          const startOffsetIsoString = dayjs
            .tz(this.#start, timezone)
            .utcOffset(offset, true)
            .format();
          dateProperties.start = startOffsetIsoString;
          if (end) {
            const endOffsetIsoString = dayjs
              .tz(end, timezone)
              .set('hours', dayjs(this.#start).get('hours'))
              .set('minutes', dayjs(this.#start).get('minutes'))
              .set('seconds', dayjs(this.#start).get('seconds'))
              .set('milliseconds', dayjs(this.#start).get('milliseconds'))
              .utcOffset(offset, true)
              .format();
            dateProperties.end = endOffsetIsoString;
          }
        } else {
          dateProperties.start = startIsoString;
          if (end) {
            const endIsoString = dayjs(dateProperties.end).toISOString();
            dateProperties.end = endIsoString;
          }
        }
      }
    }
    return {
      date: dateProperties,
    } as DateNotionValue;
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {DateNotionValue} notionValue
   * @return {*}  {DateFriendlyValue}
   * @memberof Date
   */
  static getValue(notionValue: DateNotionValue): DateFriendlyValue {
    const value: DateFriendlyValue = {
      start: new globalThis.Date(notionValue.date.start),
    };
    if (notionValue.date.end) {
      value.end = new globalThis.Date(notionValue.date.end);
    }
    return value;
  }
}

export { Date };
export * from './types';
