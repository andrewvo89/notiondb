import { PageResponse, NotionProperty } from '../notion/types';
declare class Database {
    #private;
    constructor(id: string, title: string, properties: NotionProperty[]);
    get id(): string;
    get title(): string;
    get properties(): NotionProperty[];
    get pages(): {
        getAll: (excludeProperties?: string[] | undefined) => Promise<Record<string, any>[]>;
    };
    createPage(data: Record<string, any>): Promise<PageResponse | undefined>;
}
export default Database;
