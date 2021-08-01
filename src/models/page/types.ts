import { Filter } from '../filter';
import { NotionPropertyData } from '../notion';
import { Sort } from '../sort';

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

interface PageObject {
  id: string;
  title: string;
  url: string;
  archived: boolean;
  createdTime: globalThis.Date;
  lastEditedTime: globalThis.Date;
  properties: Record<string, any>;
}

type PropertyData =
  | string
  | string[]
  | number
  | globalThis.Date
  | boolean
  | PropertyOptions;

interface PropertyOptions {
  value: string | number | globalThis.Date | boolean;
  options: Record<string, any>;
}

function isPropertyOptions(object: any): object is PropertyOptions {
  return 'options' in object && 'value' in object;
}

export {
  PageResponse,
  PageOptions,
  PageObject,
  PropertyData,
  PropertyOptions,
  isPropertyOptions,
};
