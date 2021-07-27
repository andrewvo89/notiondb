import { PeopleNotionValue } from './types';
import { PropertyData } from '../types';

class People implements PropertyData {
  #values: string[];

  constructor(values: string[]) {
    this.#values = values;
  }

  get notionValue() {
    return {
      people: this.#values.map((value) => ({
        object: 'user',
        id: value,
      })),
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

export default People;
