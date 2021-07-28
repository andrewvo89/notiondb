import dayjs from 'dayjs';
import dayjsTimezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { DateFriendlyValue, DateNotionValue, DateOptions } from '.';
import { PropertyInterface } from '..';
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
        dateProperties.start = dayjs
          .tz(dateProperties.start, timezone)
          .format('YYYY-MM-DD');
        if (dateProperties.end) {
          dateProperties.end = dayjs
            .tz(dateProperties.end, timezone)
            .format('YYYY-MM-DD');
        }
      }
      if (includeTime) {
        const startIsoString = dayjs(dateProperties.start).toISOString();
        const endIsoString = dayjs(dateProperties.end).toISOString();
        if (timezone) {
          const offset =
            dayjs.tz(dateProperties.start, timezone).utcOffset() / 60;
          const startOffsetIsoString = dayjs
            .utc(startIsoString)
            .utcOffset(offset, true)
            .format();
          const endOffsetIsoString = dayjs
            .utc(endIsoString)
            .utcOffset(offset, true)
            .format();
          dateProperties.start = startOffsetIsoString;
          dateProperties.end = endOffsetIsoString;
        } else {
          dateProperties.start = startIsoString;
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
