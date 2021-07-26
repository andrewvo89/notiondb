import { NotionUrlTypes } from './types';
declare class NotionUrl {
    #private;
    constructor(url: string, type: NotionUrlTypes);
    getId(): string;
    get url(): string;
}
export default NotionUrl;
