interface UserResponse {
  object: 'user';
  id: string;
  type: 'person' | 'bot';
  name: string;
  avatar_url: string;
  person?: {
    email: string;
  };
  bot?: {};
}

interface UserObject {
  id: string;
  name: string;
  avatar: string;
  email?: string;
}

export { UserResponse, UserObject };
