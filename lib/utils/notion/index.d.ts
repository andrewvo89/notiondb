import NotionId from '../../models/notion/notion-id';
import NotionUrl from '../../models/notion/notion-url';
declare function getIdFromUrl(notionUrl: NotionUrl): string;
declare function getIdFromId(notionId: NotionId): string;
export { getIdFromUrl, getIdFromId };
