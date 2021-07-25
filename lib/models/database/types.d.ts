import { NotionProperty, RichTextObject } from './../notion/types';
interface DatabaseResponse {
    object: 'database';
    id: string;
    created_time: string;
    last_edited_time: string;
    title: RichTextObject;
    properties: Record<string, NotionProperty>;
    parent: {
        type: string;
        page_id: string;
    };
}
export { DatabaseResponse };
