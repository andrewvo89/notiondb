import { Filter } from '../../models/filter/types';
import { NotionProperty, NotionPropertyData } from '../../models/notion/types';
import { NotionUrlTypes } from '../../models/notion/notion-url/types';
import { Sort } from '../../models/sort/types';
declare function getIdFromUrl(url: string, type: NotionUrlTypes): string;
declare function getIdFromId(id: string): string;
declare function transformStringToUUID(id: string): string;
declare function validateFilters(filter: Filter, properties: NotionProperty[]): {
    valid: boolean;
    errors: string[];
};
declare function validateSorts(sorts: Sort[], properties: NotionProperty[]): {
    valid: boolean;
    errors: string[];
};
declare function validatePropertiesExist(propertyNames: string[], properties: NotionProperty[]): {
    valid: boolean;
    errors: string[];
};
declare function transformToNotionProperties(properties: NotionProperty[], data: Record<string, any>): Record<string, any>;
declare function transformFromNotionProperties(propertyData: NotionPropertyData): any;
export { getIdFromUrl, getIdFromId, validateFilters, validateSorts, validatePropertiesExist, transformFromNotionProperties, transformToNotionProperties, transformStringToUUID, };
