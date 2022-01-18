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
  }[];
}

interface PeopleFriendlyValue {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export { PeopleNotionValue, PeopleFriendlyValue };
