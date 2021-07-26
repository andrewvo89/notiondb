import { NotionProperty } from '../notion/types';
import NotionUrl from '../notion/notion-url';
import NotionId from '../notion/notion-id';
declare class Page {
    #private;
    constructor(id: string, url: string, properties: Record<string, any>, archived: boolean);
    get properties(): Record<string, any>;
    get archived(): boolean;
    static get(identifer: NotionUrl | NotionId, excludeProperties?: string[]): Promise<Page>;
    static getAll(databaseId: string, excludeProperties?: string[]): Promise<Record<string, any>[]>;
    static create(databaseId: string, notionProperties: NotionProperty[], data: Record<string, any>): Promise<Page>;
    update(): void;
    restore(): Promise<Page>;
    delete(): Promise<Page>;
}
export default Page;
