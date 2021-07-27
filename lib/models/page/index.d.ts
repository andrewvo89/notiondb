import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import { NotionProperty } from '../notion/types';
import { PageOptions } from './types';
declare class Page {
    #private;
    constructor(id: string, url: string, notionProperties: NotionProperty[], properties: Record<string, any>, archived: boolean);
    get properties(): Record<string, any>;
    get archived(): boolean;
    static get(notionProperties: NotionProperty[], identifer: NotionUrl | NotionId, excludeProperties?: string[]): Promise<Page>;
    static getMany(databaseId: string, notionProperties: NotionProperty[], options: PageOptions): Promise<Record<string, any>[]>;
    static getAll(databaseId: string, notionProperties: NotionProperty[], excludeProperties?: string[]): Promise<Record<string, any>[]>;
    static create(databaseId: string, notionProperties: NotionProperty[], data: Record<string, any>): Promise<Page>;
    update(data: Record<string, any>): Promise<Page>;
    restore(): Promise<Page>;
    delete(): Promise<Page>;
}
export default Page;
