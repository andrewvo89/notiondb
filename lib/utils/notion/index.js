"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformStringToUUID = exports.transformToNotionProperties = exports.transformFromNotionProperties = exports.validatePropertiesExist = exports.validateSorts = exports.validateFilters = exports.getIdFromId = exports.getIdFromUrl = void 0;
const uuid_1 = require("uuid");
const checkbox_filter_1 = __importDefault(require("../../models/filter/checkbox-filter"));
const compound_filter_1 = __importDefault(require("../../models/filter/compound-filter"));
const date_filter_1 = __importDefault(require("../../models/filter/date-filter"));
const file_filter_1 = __importDefault(require("../../models/filter/file-filter"));
const formula_filter_1 = __importDefault(require("../../models/filter/formula-filter"));
const multi_select_filter_1 = __importDefault(require("../../models/filter/multi-select-filter"));
const number_filter_1 = __importDefault(require("../../models/filter/number-filter"));
const people_filter_1 = __importDefault(require("../../models/filter/people-filter"));
const relation_filter_1 = __importDefault(require("../../models/filter/relation-filter"));
const select_filter_1 = __importDefault(require("../../models/filter/select-filter"));
const text_filter_1 = __importDefault(require("../../models/filter/text-filter"));
const types_1 = require("../../models/notion/notion-url/types");
const property_data_1 = require("../../models/property-data");
const property_and_timestamp_sort_1 = __importDefault(require("../../models/sort/property-and-timestamp-sort"));
const property_sort_1 = __importDefault(require("../../models/sort/property-sort"));
function getIdFromUrl(url, type) {
    var _a;
    const id = (type === types_1.NotionUrlTypes.DATABASE
        ? (_a = url.split('/').pop()) === null || _a === void 0 ? void 0 : _a.substring(0, 32)
        : url.substring(url.length - 32));
    const uuidv4 = transformStringToUUID(id);
    if (!uuid_1.validate(uuidv4)) {
        throw new Error('URL supplied was not valid.');
    }
    return id;
}
exports.getIdFromUrl = getIdFromUrl;
function getIdFromId(id) {
    const uuidv4 = transformStringToUUID(id);
    if (!uuid_1.validate(uuidv4)) {
        throw new Error('ID supplied was not valid.');
    }
    return id;
}
exports.getIdFromId = getIdFromId;
function transformStringToUUID(id) {
    const uuidv4 = `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(12, 16)}-${id.substring(16, 20)}-${id.substring(20, 32)}`;
    return uuidv4;
}
exports.transformStringToUUID = transformStringToUUID;
function validateFilters(filter, properties) {
    const propertyNames = getFilterPropertyNames(filter);
    return validatePropertiesExist(propertyNames, properties);
}
exports.validateFilters = validateFilters;
function getFilterPropertyNames(filter) {
    const propertyNames = [];
    if (filter instanceof compound_filter_1.default) {
        propertyNames.push(...getFilterPropertyNames(filter.filter1), ...getFilterPropertyNames(filter.filter2));
    }
    if (filter instanceof text_filter_1.default ||
        filter instanceof number_filter_1.default ||
        filter instanceof checkbox_filter_1.default ||
        filter instanceof select_filter_1.default ||
        filter instanceof multi_select_filter_1.default ||
        filter instanceof date_filter_1.default ||
        filter instanceof people_filter_1.default ||
        filter instanceof file_filter_1.default ||
        filter instanceof relation_filter_1.default ||
        filter instanceof formula_filter_1.default) {
        propertyNames.push(filter.property);
    }
    return propertyNames;
}
function validateSorts(sorts, properties) {
    const propertyNames = getSortPropertyNames(sorts);
    return validatePropertiesExist(propertyNames, properties);
}
exports.validateSorts = validateSorts;
function getSortPropertyNames(sorts) {
    return sorts.reduce((prevPropertyNames, sort) => {
        if (sort instanceof property_sort_1.default ||
            sort instanceof property_and_timestamp_sort_1.default) {
            return [...prevPropertyNames, sort.property];
        }
        return prevPropertyNames;
    }, []);
}
function validatePropertiesExist(propertyNames, properties) {
    const errors = [];
    for (const name of propertyNames) {
        const propertyExists = properties.some((property) => property.name === name);
        if (!propertyExists) {
            errors.push(`${name} is not a property that exists.`);
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
exports.validatePropertiesExist = validatePropertiesExist;
function transformToNotionProperties(properties, data) {
    return Object.entries(data).reduce((notionProperties, dataProperty) => {
        const [propertyName, value] = dataProperty;
        const property = properties.find((p) => p.name === propertyName);
        if (!property) {
            return notionProperties;
        }
        let propertyData;
        switch (property.type) {
            case 'title':
                propertyData = new property_data_1.Title(value);
                break;
            case 'rich_text':
                propertyData = new property_data_1.RichText(value);
                break;
            case 'number':
                // tslint:disable-next-line: no-construct
                propertyData = new property_data_1.Number(value);
                break;
            case 'select':
                propertyData = new property_data_1.Select(value);
                break;
            case 'multi_select':
                propertyData = new property_data_1.MultiSelect(value);
                break;
            case 'date':
                propertyData = new property_data_1.Date(value);
                break;
            case 'checkbox':
                propertyData = new property_data_1.Checkbox(value);
                break;
            case 'url':
                propertyData = new property_data_1.URL(value);
                break;
            case 'email':
                propertyData = new property_data_1.Email(value);
                break;
            case 'phone_number':
                propertyData = new property_data_1.PhoneNumber(value);
                break;
            default:
                return notionProperties;
        }
        return Object.assign(Object.assign({}, notionProperties), { [propertyName]: propertyData.notionValue });
    }, {});
}
exports.transformToNotionProperties = transformToNotionProperties;
function transformFromNotionProperties(propertyData) {
    const data = propertyData[propertyData.type];
    switch (propertyData.type) {
        case 'title':
            return property_data_1.Title.getValue({ title: data });
        case 'rich_text':
            return property_data_1.RichText.getValue({ rich_text: data });
        case 'number':
            return property_data_1.Number.getValue({ number: data });
        case 'select':
            return property_data_1.Select.getValue({ select: data });
        case 'multi_select':
            return property_data_1.MultiSelect.getValue({ multi_select: data });
        case 'date':
            return property_data_1.Date.getValue({ date: data });
        case 'checkbox':
            return property_data_1.Checkbox.getValue({ checkbox: data });
        case 'url':
            return property_data_1.URL.getValue({ url: data });
        case 'email':
            return property_data_1.Email.getValue({ email: data });
        case 'phone_number':
            return property_data_1.PhoneNumber.getValue({ phone_number: data });
        case 'people':
            return property_data_1.People.getValue({ people: data });
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
exports.transformFromNotionProperties = transformFromNotionProperties;
