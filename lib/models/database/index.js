"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Database_id, _Database_title, _Database_properties;
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../../utils/api"));
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
    static get(databaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield api_1.default.get(`/databases/${databaseId}`);
                const databaseProperties = response.data;
                const properties = Object.values(databaseProperties.properties).map((property) => ({
                    id: property.id,
                    name: property.name,
                    type: property.type,
                    value: property[property.type],
                }));
                const database = new Database(databaseProperties.id, databaseProperties.title.plain_text, properties);
                return database;
            }
            catch (e) {
                // console.error(e);
                return null;
            }
        });
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
function transformToNotionProperties(properties, data) {
    return Object.entries(data).reduce((notionProperties, dataProperty) => {
        const [key, value] = dataProperty;
        const propertyData = properties.find((p) => p.name === key);
        if (!propertyData) {
            return notionProperties;
        }
        switch (propertyData.type) {
            case 'title':
                return Object.assign(Object.assign({}, notionProperties), { [key]: {
                        title: [
                            {
                                type: 'text',
                                text: {
                                    content: value,
                                },
                            },
                        ],
                    } });
            case 'number':
                return Object.assign(Object.assign({}, notionProperties), { [key]: {
                        number: data[key],
                    } });
            default:
                return notionProperties;
        }
    }, {});
}
