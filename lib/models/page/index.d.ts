import NotionId from '../notion/notion-id';
import NotionUrl from '../notion/notion-url';
import { NotionProperty } from '../notion/types';
import { PageOptions } from './types';
declare class Page {
    #private;
    constructor(id: string, url: string, notionProperties: NotionProperty[], properties: Record<string, any>, archived: boolean, createdTime: globalThis.Date, lastEditedTime: globalThis.Date);
    get properties(): Record<string, any>;
    get archived(): boolean;
    get object(): {
        id: string;
        url: string;
        archived: boolean;
        properties: Record<string, any>;
        createdTime: Date;
        lastEditedTime: Date;
    };
    static get(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId, excludeProperties?: string[]): Promise<Page>;
    static getMany(databaseId: string, notionProperties: NotionProperty[], options: PageOptions, excludeProperties?: string[]): Promise<Page[]>;
    static getAll(databaseId: string, notionProperties: NotionProperty[], excludeProperties?: string[]): Promise<Page[]>;
    static create(databaseId: string, notionProperties: NotionProperty[], data: Record<string, any>): Promise<Page>;
    update(data: Record<string, any>): Promise<Page>;
    static update(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId, data: Record<string, any>): Promise<Page>;
    delete(): Promise<Page>;
    static delete(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId): Promise<Page>;
    restore(): Promise<Page>;
    static restore(notionProperties: NotionProperty[], identifier: NotionUrl | NotionId): Promise<Page>;
}
export default Page;
