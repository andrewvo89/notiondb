import CheckboxFilter from '../../models/filter/checkbox-filter';
import CompoundFilter from '../../models/filter/compound-filter';
import DateFilter from '../../models/filter/date-filter';
import FileFilter from '../../models/filter/file-filter';
import FormulaFilter from '../../models/filter/formula-filter';
import MultiSelectFilter from '../../models/filter/multi-select-filter';
import NumberFilter from '../../models/filter/number-filter';
import PeopleFilter from '../../models/filter/people-filter';
import PropertyAndTimestampSort from '../../models/sort/property-and-timestamp-sort';
import PropertySort from '../../models/sort/property-sort';
import RelationFilter from '../../models/filter/relation-filter';
import SelectFilter from '../../models/filter/select-filter';
import TextFilter from '../../models/filter/text-filter';
import { Filter } from '../../models/filter/types';
import { NotionProperty, NotionPropertyData } from '../../models/notion/types';
import { NotionUrlTypes } from '../../models/notion/notion-url/types';
import { Sort } from '../../models/sort/types';
import { validate as uuidValidate } from 'uuid';
import Property from '../../models/property';
import { PropertyInterface } from '../../models/property/types';

/**
 * Parses a Notion URL and returns the Notion ID.
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
      ...getFilterPropertyNames(filter.filter1),
      ...getFilterPropertyNames(filter.filter2),
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
    if (
      sort instanceof PropertySort ||
      sort instanceof PropertyAndTimestampSort
    ) {
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
 * @param {Record<string, any>} data
 * @return {*}  {Record<string, any>}
 */
function transformToNotionProperties(
  properties: NotionProperty[],
  data: Record<string, any>,
): Record<string, any> {
  return Object.entries(data).reduce(
    (notionProperties: Record<string, any>, dataProperty: [string, any]) => {
      const [propertyName, value] = dataProperty;
      const property = properties.find((p) => p.name === propertyName);
      if (!property) {
        return notionProperties;
      }
      let propertyData: PropertyInterface;
      switch (property.type) {
        case 'title':
          propertyData = new Property.Title(value);
          break;
        case 'rich_text':
          propertyData = new Property.RichText(value);
          break;
        case 'number':
          // tslint:disable-next-line: no-construct
          propertyData = new Property.Number(value);
          break;
        case 'select':
          propertyData = new Property.Select(value);
          break;
        case 'multi_select':
          propertyData = new Property.MultiSelect(value);
          break;
        case 'date':
          propertyData = new Property.Date(value);
          break;
        case 'checkbox':
          propertyData = new Property.Checkbox(value);
          break;
        case 'url':
          propertyData = new Property.URL(value);
          break;
        case 'email':
          propertyData = new Property.Email(value);
          break;
        case 'phone_number':
          propertyData = new Property.PhoneNumber(value);
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
      return Property.Title.getValue({ title: data });
    case 'rich_text':
      return Property.RichText.getValue({ rich_text: data });
    case 'number':
      return Property.Number.getValue({ number: data });
    case 'select':
      return Property.Select.getValue({ select: data });
    case 'multi_select':
      return Property.MultiSelect.getValue({ multi_select: data });
    case 'date':
      return Property.Date.getValue({ date: data });
    case 'checkbox':
      return Property.Checkbox.getValue({ checkbox: data });
    case 'url':
      return Property.URL.getValue({ url: data });
    case 'email':
      return Property.Email.getValue({ email: data });
    case 'phone_number':
      return Property.PhoneNumber.getValue({ phone_number: data });
    case 'people':
      return Property.People.getValue({ people: data });
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
