import Database from './models/database';
import NotionId from './models/notion/notion-id';
import NotionUrl from './models/notion/notion-url';
declare class NotionDB {
    constructor(integrationToken: string);
    getAllDatabases(): Promise<Database[]>;
    getDatabaseRef(identifer: NotionUrl | NotionId): Promise<Database>;
}
export default NotionDB;
