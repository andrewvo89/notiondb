import { NotionProperty } from '../notion/types';
declare class Page {
    #private;
    constructor(id: string, url: string, properties: Record<string, any>);
    get properties(): Record<string, any>;
    static get(): Promise<void>;
    static getAll(databaseId: string, excludeProperties?: string[]): Promise<Record<string, any>[]>;
    static create(databaseId: string, notionProperties: NotionProperty[], data: Record<string, any>): Promise<Page>;
    update(): void;
}
export default Page;
