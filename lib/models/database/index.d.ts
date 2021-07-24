import { Property } from '../notion/types';
declare class Database {
    #private;
    constructor(id: string, title: string, properties: Property[]);
    get id(): string;
    get title(): string;
    get properties(): Property[];
    static get(databaseId: string): Promise<Database | null>;
    validatePropertiesExist(propertyNames: string[]): {
        valid: boolean;
        errors: string[];
    };
    propertyExists(name: string): boolean;
}
export default Database;
