export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color:
    | 'default'
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'gray_background'
    | 'brown_background'
    | 'orange_background'
    | 'yellow_background'
    | 'green_background'
    | 'blue_background'
    | 'purple_background'
    | 'pink_background'
    | 'red_background';
}

export interface RichTextObject {
  plain_text: string;
  href?: string;
  annotations: Annotations;
  type: 'text' | 'mention' | 'equation';
}

export interface Property {
  id: string;
  type: PropertyType;
  name: string;
  [key: string]: any;
}

export type PropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'people'
  | 'files'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

export interface PageResponse {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  parent: {
    type: 'database_id';
    database_id: string;
  };
  archived: boolean;
  properties: Record<string, any>;
  url: string;
}
