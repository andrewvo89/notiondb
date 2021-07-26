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

export { PeopleNotionValue };
