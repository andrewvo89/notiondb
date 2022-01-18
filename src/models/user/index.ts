import { BACK_OFF_TIME, MAX_RETRIES } from '../../utils/api';
import { UserObject, UserResponse } from '.';

import { NotionId } from '../notion';
import { getAxiosInstance } from '../../axios';

/**
 * Class representing a Notion User.
 * @class User
 */
class User {
  #id: string;
  #name: string;
  #avatar: string | null;
  #email: string | null;

  /**
   * Creates an instance of User.
   * @param {string} id
   * @param {string} name
   * @param {string} avatar
   * @param {string} [email]
   * @memberof User
   */
  constructor(id: string, name: string, avatar: string | null, email?: string) {
    this.#id = id;
    this.#name = name;
    this.#avatar = avatar;
    this.#email = email ?? null;
  }

  /**
   * Get the JavaScript object representing the User.
   * @readonly
   * @type {UserObject}
   * @memberof User
   */
  get object(): UserObject {
    return {
      id: this.#id,
      name: this.#name,
      avatar: this.#avatar,
      email: this.#email,
    };
  }

  /**
   * Get a User using the User's ID.
   * @static
   * @param {string} userId
   * @return {*}  {Promise<User>}
   * @memberof User
   */
  static async get(identifier: NotionId): Promise<User> {
    const axiosInstance = getAxiosInstance();
    const userId = identifier.getId();
    let retries = 0;
    let user: User | null = null;
    do {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const result = response.data as UserResponse;
        if (result.person) {
          user = new User(result.id, result.name, result.avatar_url, result.person.email);
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

  /**
   * Get all Users from the Database.
   * @static
   * @return {*}  {Promise<User[]>}
   * @memberof User
   */
  static async getAll(): Promise<User[]> {
    const axiosInstance = getAxiosInstance();
    let hasMore = false;
    let nextCursor = '';
    const users: User[] = [];
    do {
      const nextCursorParam: string = hasMore ? `?start_cursor=${nextCursor}` : '';
      const response = await axiosInstance.get(`/users${nextCursorParam}`);
      const results = response.data.results as UserResponse[];
      users.push(
        ...results.map((result) =>
          result.type === 'person'
            ? new User(result.id, result.name, result.avatar_url, result.person?.email)
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
}

export { User };
export * from './types';
