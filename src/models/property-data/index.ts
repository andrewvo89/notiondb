import dayjs from 'dayjs';
import { DateOptions, PropertyData } from './types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

class Title implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      title: [
        {
          type: 'text',
          text: {
            content: this.#value,
          },
        },
      ],
    };
  }
}

class RichText implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      rich_text: [
        {
          type: 'text',
          text: {
            content: this.#value,
          },
        },
      ],
    };
  }
}

class Number implements PropertyData {
  #value: number;
  constructor(value: number) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      number: this.#value,
    };
  }
}

class Select implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      select: {
        name: this.#value,
      },
    };
  }
}

class MultiSelect implements PropertyData {
  #values: string[];

  constructor(values: string[]) {
    this.#values = values;
  }

  get notionProperty() {
    return {
      multi_select: this.#values.map((value: string) => ({ name: value })),
    };
  }
}

class Date implements PropertyData {
  #start: globalThis.Date;
  #options?: DateOptions;

  constructor(start: globalThis.Date, options?: DateOptions) {
    this.#start = start;
    this.#options = options;
  }

  get notionProperty() {
    let dateProperties: Record<string, any> = {
      start: dayjs(this.#start).format('YYYY-MM-DD'),
    };
    if (this.#options) {
      const { end, includeTime, timezone } = this.#options;
      if (end) {
        dateProperties.end = dayjs(end).format('YYYY-MM-DD');
      }
      if (timezone) {
        for (const key in dateProperties) {
          dateProperties[key] = dayjs.tz(dateProperties[key], timezone);
        }
      }
      if (includeTime) {
        for (const key in dateProperties) {
          const isoString = dayjs(dateProperties[key]).toISOString();
          if (timezone) {
            const offset =
              dayjs.tz(dateProperties[key], timezone).utcOffset() / 60;
            const offsetIsoString = dayjs
              .utc(isoString)
              .utcOffset(offset, true)
              .format();
            dateProperties[key] = offsetIsoString;
          } else {
            dateProperties[key] = isoString;
          }
        }
      }
    }
    return {
      date: dateProperties,
    };
  }
}

class Checkbox implements PropertyData {
  #value: boolean;

  constructor(value: boolean) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      checkbox: this.#value,
    };
  }
}

class URL implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      url: this.#value,
    };
  }
}

class Email implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      email: this.#value,
    };
  }
}

class PhoneNumber implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionProperty() {
    return {
      phone_number: this.#value,
    };
  }
}

export {
  Title,
  RichText,
  Number,
  Select,
  MultiSelect,
  Date,
  Checkbox,
  URL,
  Email,
  PhoneNumber,
};
