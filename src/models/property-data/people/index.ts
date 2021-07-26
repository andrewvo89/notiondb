import { PropertyData } from '../types';
import { PeopleNotionValue } from './types';

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

export default People;
