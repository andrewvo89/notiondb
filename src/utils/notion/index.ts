import { validate as uuidValidate } from 'uuid';
import { NotionUrlTypes } from '../../models/notion/notion-url/types';

function getIdFromUrl(url: string, type: NotionUrlTypes): string {
  const id = (
    type === NotionUrlTypes.DATABASE
      ? url.split('/').pop()?.substring(0, 32)
      : url.substring(url.length - 32)
  ) as string;
  const uuidv4 = transformStringToUUID(id);
  if (!uuidValidate(uuidv4)) {
    throw new Error('URL supplied was not valid.');
  }
  return id;
}

function getIdFromId(id: string): string {
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
