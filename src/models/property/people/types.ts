interface PeopleNotionValue {
  people: {
    object: 'user';
    id: string;
    name: string;
    avatar_url: string;
    type: 'person' | 'bot';
    person?: {
      email: string;
    };
    bot?: {};
  }[];
}

interface PeoplePropertyObject {
  people: {};
}

interface PeopleFriendlyValue {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export { PeopleNotionValue, PeoplePropertyObject, PeopleFriendlyValue };
