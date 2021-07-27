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
import { PropertyData } from '../../models/property-data/types';
import { Sort } from '../../models/sort/types';
import { validate as uuidValidate } from 'uuid';
import {
  Checkbox,
  Date,
  Email,
  MultiSelect,
  Number,
  People,
  PhoneNumber,
  RichText,
  Select,
  Title,
  URL,
} from '../../models/property-data';

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
      let propertyData: PropertyData;
      switch (property.type) {
        case 'title':
          propertyData = new Title(value);
          break;
        case 'rich_text':
          propertyData = new RichText(value);
          break;
        case 'number':
          // tslint:disable-next-line: no-construct
          propertyData = new Number(value);
          break;
        case 'select':
          propertyData = new Select(value);
          break;
        case 'multi_select':
          propertyData = new MultiSelect(value);
          break;
        case 'date':
          propertyData = new Date(value);
          break;
        case 'checkbox':
          propertyData = new Checkbox(value);
          break;
        case 'url':
          propertyData = new URL(value);
          break;
        case 'email':
          propertyData = new Email(value);
          break;
        case 'phone_number':
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
