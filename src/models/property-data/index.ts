import dayjs from 'dayjs';
import {
  CheckboxNotionValue,
  DateNotionValue,
  DateOptions,
  EmailNotionValue,
  MultiSelectNotionValue,
  NumberNotionValue,
  PeopleNotionValue,
  PhoneNumberNotionValue,
  PropertyData,
  RichTextNotionValue,
  SelectNotionValue,
  TitleNotionValue,
  URLNotionValue,
} from './types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

class Title implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): TitleNotionValue {
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

  static getValue(notionValue: TitleNotionValue) {
    if (notionValue.title.length === 0) {
      return '';
    }
    return notionValue.title[0].text.content;
  }
}

class RichText implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): RichTextNotionValue {
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

  static getValue(notionValue: RichTextNotionValue) {
    if (notionValue.rich_text.length === 0) {
      return '';
    }
    return notionValue.rich_text[0].text.content;
  }
}

class Number implements PropertyData {
  #value: number;
  constructor(value: number) {
    this.#value = value;
  }

  get notionValue(): NumberNotionValue {
    return {
      number: this.#value,
    };
  }

  static getValue(notionValue: NumberNotionValue) {
    return notionValue.number;
  }
}

class Select implements PropertyData {
  #value: string;
  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): SelectNotionValue {
    return {
      select: {
        name: this.#value,
      },
    };
  }

  static getValue(notionValue: SelectNotionValue) {
    return notionValue.select;
  }
}

class MultiSelect implements PropertyData {
  #values: string[];

  constructor(values: string[]) {
    this.#values = values;
  }

  get notionValue(): MultiSelectNotionValue {
    return {
      multi_select: this.#values.map((value) => ({ name: value })),
    };
  }

  static getValue(notionValue: MultiSelectNotionValue) {
    return notionValue.multi_select.map((value) => value.name);
  }
}

class Date implements PropertyData {
  #start: globalThis.Date;
  #options?: DateOptions;

  constructor(start: globalThis.Date, options?: DateOptions) {
    this.#start = start;
    this.#options = options;
  }

  get notionValue(): DateNotionValue {
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

class Checkbox implements PropertyData {
  #value: boolean;

  constructor(value: boolean) {
    this.#value = value;
  }

  get notionValue(): CheckboxNotionValue {
    return {
      checkbox: this.#value,
    };
  }

  static getValue(notionValue: CheckboxNotionValue) {
    return notionValue.checkbox;
  }
}

class URL implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): URLNotionValue {
    return {
      url: this.#value,
    };
  }

  static getValue(notionValue: URLNotionValue) {
    return notionValue.url;
  }
}

class Email implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): EmailNotionValue {
    return {
      email: this.#value,
    };
  }

  static getValue(notionValue: EmailNotionValue) {
    return notionValue.email;
  }
}

class PhoneNumber implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue(): PhoneNumberNotionValue {
    return {
      phone_number: this.#value,
    };
  }

  static getValue(notionValue: PhoneNumberNotionValue) {
    return notionValue.phone_number;
  }
}

class People implements PropertyData {
  #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  get notionValue() {
    return {
      // TODO: implement writing person into database
      people: this.#value,
    };
  }

  static getValue(notionValue: PeopleNotionValue) {
    return notionValue.people.map((person) => {
      const data: {
        id: string;
        name: string;
        avatar: string;
        email?: string;
      } = {
        id: person.id,
        name: person.name ?? '',
        avatar: person.avatar_url ?? '',
      };
      if (person.person) {
        data.email = person.person.email;
      }
      return data;
    });
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
  People,
};
