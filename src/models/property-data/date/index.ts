import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import dayjsTimezone from 'dayjs/plugin/timezone';
import { PropertyData } from '../types';
import { DateNotionValue, DateOptions } from './types';
dayjs.extend(utc);
dayjs.extend(dayjsTimezone);

class Date implements PropertyData {
  #start: globalThis.Date;
  #options?: DateOptions;

  constructor(start: globalThis.Date, options?: DateOptions) {
    this.#start = start;
    this.#options = options;
  }

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

  static getValue(notionValue: DateNotionValue) {
    const value: {
      start: globalThis.Date;
      end?: globalThis.Date;
    } = {
      start: new globalThis.Date(notionValue.date.start),
    };
    if (notionValue.date.end) {
      value.end = new globalThis.Date(notionValue.date.end);
    }
    return value;
  }
}

export default Date;
