import { Property, RichTextObject } from './../notion/types';
export interface DatabaseResponse {
    object: 'database';
    id: string;
    created_time: string;
    last_edited_time: string;
    title: RichTextObject;
    properties: Record<string, Property>;
    parent: {
        type: string;
        page_id: string;
    };
}
