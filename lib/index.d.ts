import Database from './models/database';
import NotionUrl from './models/notion/notion-url';
import NotionId from './models/notion/notion-id';
declare class NotionDB {
    constructor(integrationToken: string);
    getAllDatabases(): Promise<Database[]>;
    getDatabase(identifer: NotionUrl | NotionId): Promise<Database>;
}
export default NotionDB;
