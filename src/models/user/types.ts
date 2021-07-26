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

export { UserResponse };
