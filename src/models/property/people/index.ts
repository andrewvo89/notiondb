import { PeopleFriendlyValue, PeopleNotionValue } from '.';
import { PropertyInterface } from '..';

/**
 * Class representing a People Notion type.
 * @class People
 * @implements {PropertyInterface}
 */
class People implements PropertyInterface {
  #values: string[];

  /**
   * Creates an instance of People.
   * @param {string[]} values
   * @memberof People
   */
  constructor(values: string[]) {
    this.#values = values;
  }

  /**
   * Transforms value into a Notion friendly value.
   * @readonly
   * @memberof People
   */
  get notionValue() {
    return {
      people: this.#values.map((value) => ({
        object: 'user',
        id: value,
      })),
    };
  }

  /**
   * Transforms Notion value to a friendly value.
   * @static
   * @param {PeopleNotionValue} notionValue
   * @return {*}  {PeopleFriendlyValue[]}
   * @memberof People
   */
  static getValue(notionValue: PeopleNotionValue): PeopleFriendlyValue[] {
    return notionValue.people.map((person) => {
      const data: PeopleFriendlyValue = {
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

export { People };
export * from './types';
