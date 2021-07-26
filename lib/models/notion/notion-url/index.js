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
var _NotionUrl_url, _NotionUrl_type;
Object.defineProperty(exports, "__esModule", { value: true });
const notion_1 = require("../../../utils/notion");
class NotionUrl {
    constructor(url, type) {
        _NotionUrl_url.set(this, void 0);
        _NotionUrl_type.set(this, void 0);
        __classPrivateFieldSet(this, _NotionUrl_url, url, "f");
        __classPrivateFieldSet(this, _NotionUrl_type, type, "f");
    }
    getId() {
        return notion_1.getIdFromUrl(__classPrivateFieldGet(this, _NotionUrl_url, "f"), __classPrivateFieldGet(this, _NotionUrl_type, "f"));
    }
    get url() {
        return __classPrivateFieldGet(this, _NotionUrl_url, "f");
    }
}
_NotionUrl_url = new WeakMap(), _NotionUrl_type = new WeakMap();
exports.default = NotionUrl;
