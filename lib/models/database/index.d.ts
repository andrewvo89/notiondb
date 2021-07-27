import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import Page from '../page';
import { NotionProperty } from '../notion/types';
import { PageOptions } from '../page/types';
import { User } from '../user';
declare class Database {
    #private;
    constructor(id: string, title: string, properties: NotionProperty[]);
    get id(): string;
    get title(): string;
    get properties(): NotionProperty[];
    get pages(): {
        get: (identifier: NotionUrl | NotionId, excludeProperties?: string[] | undefined) => Promise<Page>;
        getMany: (options: PageOptions, excludeProperties?: string[] | undefined) => Promise<Page[]>;
        getAll: (excludeProperties?: string[] | undefined) => Promise<Page[]>;
        create: (data: Record<string, any>) => Promise<Page>;
        update: (identifier: NotionUrl | NotionId, data: Record<string, any>) => Promise<Page>;
        delete: (identifier: NotionUrl | NotionId) => Promise<Page>;
        restore: (identifier: NotionUrl | NotionId) => Promise<Page>;
    };
    get users(): {
        get: typeof User.get;
        getAll: typeof User.getAll;
    };
}
export default Database;
