import { PageResponse, Property } from '../notion/types';
declare class Database {
    #private;
    constructor(id: string, title: string, properties: Property[]);
    get id(): string;
    get title(): string;
    get properties(): Property[];
    getAllPages(): Promise<Record<string, any>[]>;
    createPage(data: Record<string, any>): Promise<PageResponse | undefined>;
}
export default Database;
