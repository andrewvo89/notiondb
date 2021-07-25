import { validate as uuidValidate } from 'uuid';
import NotionId from '../../models/notion/notion-id';
import NotionUrl from '../../models/notion/notion-url';

function getIdFromUrl(notionUrl: NotionUrl): string {
  const id = notionUrl.url.split('/').pop()?.substring(0, 32) as string;
  const uuidv4 = transformStringToUUID(id);
  if (!uuidValidate(uuidv4)) {
    throw new Error('URL supplied was not valid.');
  }
  return id;
}

function getIdFromId(notionId: NotionId): string {
  const id = notionId.id;
  const uuidv4 = transformStringToUUID(id);
  if (!uuidValidate(uuidv4)) {
    throw new Error('ID supplied was not valid.');
  }
  return id;
}

function transformStringToUUID(id: string): string {
  const uuidv4 = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
    12,
    16,
  )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
  return uuidv4;
}

export { getIdFromUrl, getIdFromId };
