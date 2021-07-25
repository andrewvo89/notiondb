"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Database_id, _Database_title, _Database_properties;
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importStar(require("../../utils/api"));
const property_data_1 = require("../property-data");
class Database {
    constructor(id, title, properties) {
        _Database_id.set(this, void 0);
        _Database_title.set(this, void 0);
        _Database_properties.set(this, void 0);
        __classPrivateFieldSet(this, _Database_id, id, "f");
        __classPrivateFieldSet(this, _Database_title, title, "f");
        __classPrivateFieldSet(this, _Database_properties, properties, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _Database_id, "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _Database_title, "f");
    }
    get properties() {
        return __classPrivateFieldGet(this, _Database_properties, "f");
    }
    get pages() {
        return {
            getAll: (excludeProperties) => getAllPages(__classPrivateFieldGet(this, _Database_id, "f"), excludeProperties),
        };
    }
    createPage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const propertyNames = Object.keys(data);
                const { valid, errors } = validatePropertiesExist(propertyNames, __classPrivateFieldGet(this, _Database_properties, "f"));
                if (!valid) {
                    throw new Error(errors.join(', '));
                }
                const properties = transformToNotionProperties(__classPrivateFieldGet(this, _Database_properties, "f"), data);
                const response = yield api_1.default.post(`/pages`, {
                    parent: {
                        type: 'database_id',
                        database_id: __classPrivateFieldGet(this, _Database_id, "f"),
                    },
                    properties,
                });
                const pageResponse = response.data;
                return pageResponse;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
_Database_id = new WeakMap(), _Database_title = new WeakMap(), _Database_properties = new WeakMap();
exports.default = Database;
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
        case 'formula': {
            const type = propertyData.formula.type;
            return transformFromNotionProperties({
                id: propertyData.id,
                type: type,
                [type]: propertyData.formula[type],
            });
        }
        default:
            return undefined;
    }
}
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
                propertyData = value;
                break;
            case 'rich_text':
                propertyData = value;
                break;
            case 'number':
                propertyData = value;
                break;
            case 'select':
                propertyData = value;
                break;
            case 'multi_select':
                propertyData = value;
                break;
            case 'date':
                propertyData = value;
                break;
            case 'checkbox':
                propertyData = value;
                break;
            case 'url':
                propertyData = value;
                break;
            case 'email':
                propertyData = value;
                break;
            case 'phone_number':
                propertyData = value;
                break;
            default:
                return notionProperties;
        }
        return Object.assign(Object.assign({}, notionProperties), { [propertyName]: propertyData.notionValue });
    }, {});
}
function getAllPages(databaseId, excludeProperties) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let hasMore = false;
        let nextCursor = '';
        const pages = [];
        do {
            let retries = 0;
            try {
                const nextCursorParam = hasMore
                    ? `?start_cursor=${nextCursor}`
                    : '';
                const response = yield api_1.default.post(`/databases/${databaseId}/query${nextCursorParam}`);
                const results = response.data.results;
                pages.push(...results.map((result) => Object.entries(result.properties).reduce((properties, [propertyName, value]) => {
                    if (excludeProperties === null || excludeProperties === void 0 ? void 0 : excludeProperties.includes(propertyName)) {
                        return properties;
                    }
                    if (propertyName === 'Owner') {
                        console.log('value', value);
                    }
                    return Object.assign(Object.assign({}, properties), { [propertyName]: transformFromNotionProperties(value) });
                }, {})));
                hasMore = response.data['has_more'];
                if (hasMore) {
                    nextCursor = response.data['next_cursor'];
                }
            }
            catch (e) {
                console.error(e);
                const error = e;
                if (error.isAxiosError && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                    yield new Promise((resolve) => globalThis.setTimeout(() => {
                        resolve(null);
                    }, api_1.BACK_OFF_TIME));
                }
                if (retries === api_1.MAX_RETRIES) {
                    continue;
                }
                retries++;
            }
        } while (hasMore);
        return pages;
    });
}
