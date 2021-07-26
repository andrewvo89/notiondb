import { NotionProperty } from '../notion/types';
import Page from '../page';
import { PageOptions } from '../page/types';
import { User } from '../user';
declare class Database {
    #private;
    constructor(id: string, title: string, properties: NotionProperty[]);
    get id(): string;
    get title(): string;
    get properties(): NotionProperty[];
    get pages(): {
        get: typeof Page.get;
        getMany: (options: PageOptions) => Promise<Record<string, any>[]>;
        getAll: (excludeProperties?: string[] | undefined) => Promise<Record<string, any>[]>;
        create: (data: Record<string, any>) => Promise<Page>;
    };
    get users(): {
        get: typeof User.get;
        getAll: typeof User.getAll;
    };
}
export default Database;
