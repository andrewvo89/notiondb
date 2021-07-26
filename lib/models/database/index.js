"use strict";
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
const page_1 = __importDefault(require("../page"));
const user_1 = require("../user");
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
            get: page_1.default.get,
            getAll: (excludeProperties) => page_1.default.getAll(__classPrivateFieldGet(this, _Database_id, "f"), excludeProperties),
            create: (data) => page_1.default.create(__classPrivateFieldGet(this, _Database_id, "f"), __classPrivateFieldGet(this, _Database_properties, "f"), data),
        };
    }
    get users() {
        return {
            get: user_1.User.get,
            getAll: user_1.User.getAll,
        };
    }
}
_Database_id = new WeakMap(), _Database_title = new WeakMap(), _Database_properties = new WeakMap();
exports.default = Database;
