import { Filter } from '../filter/types';
import { NotionPropertyData } from '../notion/types';
import { Sort } from '../sort/types';
interface PageResponse {
    object: 'page';
    id: string;
    created_time: string;
    last_edited_time: string;
    parent: {
        type: 'database_id';
        database_id: string;
    };
    archived: boolean;
    properties: Record<string, NotionPropertyData>;
    url: string;
}
interface PageOptions {
    filter?: Filter;
    sorts?: Sort[];
}
export { PageResponse, PageOptions };
