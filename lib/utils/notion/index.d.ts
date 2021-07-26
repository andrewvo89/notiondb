import { NotionUrlTypes } from '../../models/notion/notion-url/types';
declare function getIdFromUrl(url: string, type: NotionUrlTypes): string;
declare function getIdFromId(id: string): string;
export { getIdFromUrl, getIdFromId };
