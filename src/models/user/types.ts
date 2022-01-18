interface UserResponse {
  object: 'user';
  id: string;
  type: 'person' | 'bot';
  name: string;
  avatar_url: string | null;
  person?: {
    email: string;
  };
}

interface UserObject {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
}

export { UserResponse, UserObject };
