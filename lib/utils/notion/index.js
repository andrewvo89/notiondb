"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdFromId = exports.getIdFromUrl = void 0;
const uuid_1 = require("uuid");
const types_1 = require("../../models/notion/notion-url/types");
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
