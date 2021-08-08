import { CreatedTime } from '../../models/property/created-time';
import { isPropertyOptions, PropertyData } from '../../models';
import { LastEditedTime } from '../../models/property/last-edited-time';
import { PropertySort } from '../../models/sort';
import { RelationFilter, SelectFilter } from '../../models/filter';
import { Sort } from '../../models/sort';
import { validate as uuidValidate } from 'uuid';
import {
  Checkbox,
  Date,
  Email,
  MultiSelect,
  Number,
  People,
  PhoneNumber,
  PropertyInterface,
  RichText,
  Select,
  Title,
  URL,
} from '../../models/property';
import {
  Filter,
  TextFilter,
  CheckboxFilter,
  CompoundFilter,
  DateFilter,
  FileFilter,
  FormulaFilter,
  MultiSelectFilter,
  NumberFilter,
  PeopleFilter,
} from '../../models/filter';

import {
  NotionProperty,
  NotionPropertyData,
  NotionUrlTypes,
} from '../../models/notion';

/**
 * Parses a Notion URL and returns the Notion ID.
 * Different URL formats for Page and Database.
 * Example page format:
 * https://www.notion.so/notion-user/Test-a6d8c987cb684c2aa740a8c99b314ace
 * Example Database format:
 * https://www.notion.so/notion-uset/9dbea923e20270b8bccb3138ca2ed54b?v=3cbf978e48034ffa87b9e0c899a5a6d9
 * @param {string} url
 * @param {NotionUrlTypes} type
 * @return {*}  {string}
 */
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

/**
 * Validates that the ID is a valid UUIDv4.
 * @param {string} id
 * @return {*}  {string}
 */
function getIdFromId(id: string): string {
  if (!uuidValidate(id)) {
    const uuidv4 = transformStringToUUID(id);
    if (!uuidValidate(uuidv4)) {
      throw new Error('ID supplied was not valid.');
    }
    return uuidv4;
  }
  return id;
}

/**
 * Transforms a 32 byte string to UUIDv4 format.
 * @param {string} id
 * @return {*}  {string}
 */
function transformStringToUUID(id: string): string {
  const uuidv4 = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(
    12,
    16,
  )}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
  return uuidv4;
}

/**
 * Validates filter's property names to ensure they are valid Database properties.
 * @param {Filter} filter
 * @param {NotionProperty[]} properties
 * @return {*}  {{
 *   valid: boolean;
 *   errors: string[];
 * }}
 */
function validateFilters(
  filter: Filter,
  properties: NotionProperty[],
): {
  valid: boolean;
  errors: string[];
} {
  const propertyNames = getFilterPropertyNames(filter);
  return validatePropertiesExist(propertyNames, properties);
}

/**
 * Recursively traverses Filter instances to get all property names.
 * @param {Filter} filter
 * @return {*}  {string[]}
 */
function getFilterPropertyNames(filter: Filter): string[] {
  const propertyNames: string[] = [];
  if (filter instanceof CompoundFilter) {
    propertyNames.push(
      ...filter.filters.reduce(
        (prevPropertyNames: string[], currFilter) => [
          ...prevPropertyNames,
          ...getFilterPropertyNames(currFilter),
        ],
        [],
      ),
    );
  }
  if (
    filter instanceof TextFilter ||
    filter instanceof NumberFilter ||
    filter instanceof CheckboxFilter ||
    filter instanceof SelectFilter ||
    filter instanceof MultiSelectFilter ||
    filter instanceof DateFilter ||
    filter instanceof PeopleFilter ||
    filter instanceof FileFilter ||
    filter instanceof RelationFilter ||
    filter instanceof FormulaFilter
  ) {
    propertyNames.push(filter.property);
  }
  return propertyNames;
}

/**
 * Validates sort property names to ensure they are valid Database properties.
 * @param {Sort[]} sorts
 * @param {NotionProperty[]} properties
 * @return {*}  {{
 *   valid: boolean;
 *   errors: string[];
 * }}
 */
function validateSorts(
  sorts: Sort[],
  properties: NotionProperty[],
): {
  valid: boolean;
  errors: string[];
} {
  const propertyNames = getSortPropertyNames(sorts);
  return validatePropertiesExist(propertyNames, properties);
}

/**
 * Gets property names from an array of Sort instances.
 * @param {Sort[]} sorts
 * @return {*}  {string[]}
 */
function getSortPropertyNames(sorts: Sort[]): string[] {
  return sorts.reduce((prevPropertyNames: string[], sort: Sort) => {
    if (sort instanceof PropertySort) {
      return [...prevPropertyNames, sort.property];
    }
    return prevPropertyNames;
  }, []);
}

/**
 * Validates an array of property names against a Database's properties.
 * @param {string[]} propertyNames
 * @param {NotionProperty[]} properties
 * @return {*}  {{
 *   valid: boolean;
 *   errors: string[];
 * }}
 */
function validatePropertiesExist(
  propertyNames: string[],
  properties: NotionProperty[],
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  for (const name of propertyNames) {
    const propertyExists = properties.some(
      (property) => property.name === name,
    );
    if (!propertyExists) {
      errors.push(`${name} is not a property that exists.`);
    }
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Transforms raw data to Notion friendly data to write to a Notion Database.
 * @param {NotionProperty[]} properties
 * @param {Record<string, PropertyData>} data
 * @return {*}  {Record<string, any>}
 */
function transformToNotionProperties(
  properties: NotionProperty[],
  data: Record<string, PropertyData>,
): Record<string, any> {
  return Object.entries(data).reduce(
    (
      notionProperties: Record<string, any>,
      dataProperty: [string, PropertyData],
    ) => {
      const [propertyName, value] = dataProperty;
      const property = properties.find((p) => p.name === propertyName);
      if (!property) {
        return notionProperties;
      }
      let propertyData: PropertyInterface;
      switch (property.type) {
        case 'title':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new Title(value);
          break;
        case 'rich_text':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new RichText(value);
          break;
        case 'number':
          if (typeof value !== 'number') {
            throw new Error(`${propertyName} must be a string.`);
          }
          // tslint:disable-next-line: no-construct
          propertyData = new Number(value);
          break;
        case 'select':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new Select(value);
          break;
        case 'multi_select':
          if (!Array.isArray(value)) {
            throw new Error(`${propertyName} must be an array of string.`);
          }
          if (value.some((v) => typeof v !== 'string')) {
            throw new Error(`${propertyName} must be an array of string.`);
          }
          propertyData = new MultiSelect(value);
          break;
        case 'date':
          if (
            isPropertyOptions(value) &&
            value.value instanceof globalThis.Date
          ) {
            propertyData = new Date(value.value, value.options);
          } else {
            if (!(value instanceof globalThis.Date)) {
              throw new Error(`${propertyName} must be date object.`);
            }
            propertyData = new Date(value);
          }
          break;
        case 'checkbox':
          if (typeof value !== 'boolean') {
            throw new Error(`${propertyName} must be a boolean.`);
          }
          propertyData = new Checkbox(value);
          break;
        case 'url':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new URL(value);
          break;
        case 'email':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new Email(value);
          break;
        case 'phone_number':
          if (typeof value !== 'string') {
            throw new Error(`${propertyName} must be a string.`);
          }
          propertyData = new PhoneNumber(value);
          break;
        default:
          return notionProperties;
      }
      return {
        ...notionProperties,
        [propertyName]: propertyData.notionValue,
      };
    },
    {},
  );
}

/**
 * Transforms Notion value to a friendly value.
 * @param {NotionPropertyData} propertyData
 * @return {*}  {*}
 */
function transformFromNotionProperties(propertyData: NotionPropertyData): any {
  const data = propertyData[propertyData.type];
  switch (propertyData.type) {
    case 'title':
      return Title.getValue({ title: data });
    case 'rich_text':
      return RichText.getValue({ rich_text: data });
    case 'number':
      return Number.getValue({ number: data });
    case 'select':
      return Select.getValue({ select: data });
    case 'multi_select':
      return MultiSelect.getValue({ multi_select: data });
    case 'date':
      return Date.getValue({ date: data });
    case 'created_time':
      return CreatedTime.getValue({ created_time: data });
    case 'last_edited_time':
      return LastEditedTime.getValue({ last_edited_time: data });
    case 'checkbox':
      return Checkbox.getValue({ checkbox: data });
    case 'url':
      return URL.getValue({ url: data });
    case 'email':
      return Email.getValue({ email: data });
    case 'phone_number':
      return PhoneNumber.getValue({ phone_number: data });
    case 'people':
      return People.getValue({ people: data });
    case 'formula': {
      const type = propertyData.formula.type;
      return transformFromNotionProperties({
        id: propertyData.id,
        type,
        [type]: propertyData.formula[type],
      });
    }
    default:
      return undefined;
  }
}

export {
  getIdFromUrl,
  getIdFromId,
  validateFilters,
  validateSorts,
  validatePropertiesExist,
  transformFromNotionProperties,
  transformToNotionProperties,
  transformStringToUUID,
};
