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
var _NotionId_id;
Object.defineProperty(exports, "__esModule", { value: true });
const notion_1 = require("../../../utils/notion");
class NotionId {
    constructor(id) {
        _NotionId_id.set(this, void 0);
        __classPrivateFieldSet(this, _NotionId_id, id, "f");
    }
    getId() {
        return notion_1.getIdFromId(__classPrivateFieldGet(this, _NotionId_id, "f"));
    }
    get id() {
        return __classPrivateFieldGet(this, _NotionId_id, "f");
    }
}
_NotionId_id = new WeakMap();
exports.default = NotionId;
