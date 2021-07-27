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
var _Page_id, _Page_url, _Page_properties, _Page_archived;
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importStar(require("../../utils/api"));
const notion_1 = require("../../utils/notion");
class Page {
    constructor(id, url, properties, archived) {
        _Page_id.set(this, void 0);
        _Page_url.set(this, void 0);
        _Page_properties.set(this, void 0);
        _Page_archived.set(this, void 0);
        __classPrivateFieldSet(this, _Page_id, id, "f");
        __classPrivateFieldSet(this, _Page_url, url, "f");
        __classPrivateFieldSet(this, _Page_properties, properties, "f");
        __classPrivateFieldSet(this, _Page_archived, archived, "f");
    }
    get properties() {
        return __classPrivateFieldGet(this, _Page_properties, "f");
    }
    get archived() {
        return __classPrivateFieldGet(this, _Page_archived, "f");
    }
    static get(identifer, excludeProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageId = identifer.getId();
            let retries = 0;
            let page = null;
            do {
                try {
                    const response = yield api_1.default.get(`/pages/${pageId}`);
                    const pageResponse = response.data;
                    const properties = Object.entries(pageResponse.properties).reduce((prevProperties, [propertyName, value]) => {
                        if (excludeProperties === null || excludeProperties === void 0 ? void 0 : excludeProperties.includes(propertyName)) {
                            return prevProperties;
                        }
                        return Object.assign(Object.assign({}, prevProperties), { [propertyName]: notion_1.transformFromNotionProperties(value) });
                    }, {});
                    page = new Page(pageResponse.id, pageResponse.url, properties, pageResponse.archived);
                }
                catch (error) {
                    if (retries === api_1.MAX_RETRIES) {
                        break;
                    }
                    yield new Promise((resolve) => globalThis.setTimeout(() => {
                        retries++;
                        resolve(null);
                    }, api_1.BACK_OFF_TIME));
                }
            } while (!page);
            if (!page) {
                throw new Error(`Page ${pageId} does not exist.`);
            }
            return page;
        });
    }
    static getMany(databaseId, notionProperties, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.filter && !options.sorts) {
                throw new Error('Must supply at least one Filter or Sort condition.');
            }
            let hasMore = false;
            let nextCursor = '';
            const pages = [];
            do {
                let retries = 0;
                try {
                    const bodyParams = {};
                    if (options.filter) {
                        const { valid, errors } = notion_1.validateFilters(options.filter, notionProperties);
                        if (!valid) {
                            throw new Error(errors.join(', '));
                        }
                        bodyParams.filter = options.filter.transformToNotionFilter();
                    }
                    if (options.sorts) {
                        const { valid, errors } = notion_1.validateSorts(options.sorts, notionProperties);
                        if (!valid) {
                            throw new Error(errors.join(', '));
                        }
                        bodyParams.sorts = options.sorts.map((sort) => sort.transformToNotionSort());
                    }
                    if (hasMore) {
                        bodyParams.start_cursor = nextCursor;
                    }
                    const response = yield api_1.default.post(`/databases/${databaseId}/query`, bodyParams);
                    const results = response.data.results;
                    if (results.length === 0) {
                        continue;
                    }
                    const pageProperties = results.map((pageResponse) => {
                        const properties = Object.entries(pageResponse.properties).reduce((prevProperties, [propertyName, value]) => {
                            var _a;
                            if ((_a = options === null || options === void 0 ? void 0 : options.excludeProperties) === null || _a === void 0 ? void 0 : _a.includes(propertyName)) {
                                return prevProperties;
                            }
                            return Object.assign(Object.assign({}, prevProperties), { [propertyName]: notion_1.transformFromNotionProperties(value) });
                        }, {});
                        const page = new Page(pageResponse.id, pageResponse.url, properties, pageResponse.archived);
                        return page.properties;
                    });
                    pages.push(...pageProperties);
                    hasMore = response.data.has_more;
                    if (hasMore) {
                        nextCursor = response.data.next_cursor;
                    }
                }
                catch (error) {
                    if (!error.isAxiosError) {
                        throw new Error(error);
                    }
                    if (retries === api_1.MAX_RETRIES) {
                        continue;
                    }
                    yield new Promise((resolve) => globalThis.setTimeout(() => {
                        retries++;
                        resolve(null);
                    }, api_1.BACK_OFF_TIME));
                }
            } while (hasMore);
            return pages;
        });
    }
    static getAll(databaseId, excludeProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            let hasMore = false;
            let nextCursor = '';
            const pages = [];
            do {
                let retries = 0;
                try {
                    const bodyParams = {};
                    if (hasMore) {
                        bodyParams.start_cursor = nextCursor;
                    }
                    const response = yield api_1.default.post(`/databases/${databaseId}/query`, bodyParams);
                    const results = response.data.results;
                    if (results.length === 0) {
                        continue;
                    }
                    const pageProperties = results.map((pageResponse) => {
                        const properties = Object.entries(pageResponse.properties).reduce((prevProperties, [propertyName, value]) => {
                            if (excludeProperties === null || excludeProperties === void 0 ? void 0 : excludeProperties.includes(propertyName)) {
                                return prevProperties;
                            }
                            return Object.assign(Object.assign({}, prevProperties), { [propertyName]: notion_1.transformFromNotionProperties(value) });
                        }, {});
                        const page = new Page(pageResponse.id, pageResponse.url, properties, pageResponse.archived);
                        return page.properties;
                    });
                    pages.push(...pageProperties);
                    hasMore = response.data.has_more;
                    if (hasMore) {
                        nextCursor = response.data.next_cursor;
                    }
                }
                catch (error) {
                    if (!error.isAxiosError) {
                        throw new Error(error);
                    }
                    if (retries === api_1.MAX_RETRIES) {
                        continue;
                    }
                    yield new Promise((resolve) => globalThis.setTimeout(() => {
                        retries++;
                        resolve(null);
                    }, api_1.BACK_OFF_TIME));
                }
            } while (hasMore);
            return pages;
        });
    }
    static create(databaseId, notionProperties, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let retries = 0;
            const propertyNames = Object.keys(data);
            const { valid, errors } = notion_1.validatePropertiesExist(propertyNames, notionProperties);
            if (!valid) {
                throw new Error(errors.join(', '));
            }
            let page = null;
            do {
                try {
                    const response = yield api_1.default.post(`/pages`, {
                        parent: {
                            type: 'database_id',
                            database_id: databaseId,
                        },
                        properties: notion_1.transformToNotionProperties(notionProperties, data),
                    });
                    const pageResponse = response.data;
                    const properties = Object.entries(pageResponse.properties).reduce((prevProperties, [propertyName, value]) => {
                        return Object.assign(Object.assign({}, prevProperties), { [propertyName]: notion_1.transformFromNotionProperties(value) });
                    }, {});
                    page = new Page(pageResponse.id, pageResponse.url, properties, pageResponse.archived);
                }
                catch (error) {
                    if (!error.isAxiosError) {
                        throw new Error(error);
                    }
                    if (retries === api_1.MAX_RETRIES) {
                        break;
                    }
                    yield new Promise((resolve) => globalThis.setTimeout(() => {
                        retries++;
                        resolve(null);
                    }, api_1.BACK_OFF_TIME));
                }
            } while (!page);
            if (!page) {
                throw new Error(`Page failed to create.`);
            }
            return page;
        });
    }
    // update() {}
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _Page_archived, "f")) {
                throw new Error(`Page ${__classPrivateFieldGet(this, _Page_id, "f")} is already active.`);
            }
            return yield setArchived(__classPrivateFieldGet(this, _Page_id, "f"), false);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _Page_archived, "f")) {
                throw new Error(`Page ${__classPrivateFieldGet(this, _Page_id, "f")} has already been deleted.`);
            }
            return yield setArchived(__classPrivateFieldGet(this, _Page_id, "f"), true);
        });
    }
}
_Page_id = new WeakMap(), _Page_url = new WeakMap(), _Page_properties = new WeakMap(), _Page_archived = new WeakMap();
exports.default = Page;
function setArchived(pageId, archived) {
    return __awaiter(this, void 0, void 0, function* () {
        let retries = 0;
        let page = null;
        do {
            try {
                const response = yield api_1.default.patch(`/pages/${pageId}`, {
                    archived,
                });
                const pageResponse = response.data;
                const properties = Object.entries(pageResponse.properties).reduce((prevProperties, [propertyName, value]) => {
                    return Object.assign(Object.assign({}, prevProperties), { [propertyName]: notion_1.transformFromNotionProperties(value) });
                }, {});
                page = new Page(pageResponse.id, pageResponse.url, properties, pageResponse.archived);
            }
            catch (error) {
                if (retries === api_1.MAX_RETRIES) {
                    break;
                }
                yield new Promise((resolve) => globalThis.setTimeout(() => {
                    retries++;
                    resolve(null);
                }, api_1.BACK_OFF_TIME));
            }
        } while (!page);
        if (!page) {
            const action = archived ? 'delete' : 'restore';
            throw new Error(`Page ${pageId} failed to ${action}.`);
        }
        return page;
    });
}
