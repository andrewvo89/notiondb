import { AxiosError } from 'axios';
import axios, { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { UserResponse } from './types';

class User {
  #id: string;
  #name: string;
  #avatar: string;
  #email?: string;

  constructor(id: string, name: string, avatar: string, email?: string) {
    this.#id = id;
    this.#name = name;
    this.#avatar = avatar;
    this.#email = email;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get avatar() {
    return this.#avatar;
  }

  get email() {
    return this.#email;
  }

  static async getAll(): Promise<User[]> {
    let hasMore: boolean = false;
    let nextCursor: string = '';
    const users: User[] = [];
    do {
      const nextCursorParam: string = hasMore
        ? `?start_cursor=${nextCursor}`
        : '';
      const response = await axios.get(`/users${nextCursorParam}`);
      const results = response.data.results as UserResponse[];
      users.push(
        ...results.map((result) =>
          result.person
            ? new User(
                result.id,
                result.name,
                result.avatar_url,
                result.person.email,
              )
            : new User(result.id, result.name, result.avatar_url),
        ),
      );
      hasMore = response.data.has_more;
      if (hasMore) {
        nextCursor = response.data.next_cursor;
      }
    } while (hasMore);
    return users;
  }

  static async get(userId: string): Promise<User> {
    let retries = 0;
    let user: User | null = null;
    do {
      try {
        const response = await axios.get(`/users/${userId}`);
        const result = response.data as UserResponse;
        if (result.person) {
          user = new User(
            result.id,
            result.name,
            result.avatar_url,
            result.person.email,
          );
        } else {
          user = new User(result.id, result.name, result.avatar_url);
        }
      } catch (error) {
        if (retries === MAX_RETRIES) {
          break;
        }
        await new Promise((resolve) =>
          globalThis.setTimeout(() => {
            retries++;
            resolve(null);
          }, BACK_OFF_TIME),
        );
      }
    } while (!user);
    if (!user) {
      throw new Error(`User ${userId} does not exist.`);
    }
    return user;
  }
}

export { User };
