"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACK_OFF_TIME = void 0;
const axios_1 = __importDefault(require("axios"));
let axios = axios_1.default.create({
    baseURL: 'https://api.notion.com/v1',
    headers: {
        'Notion-Version': '2021-05-13',
    },
});
const MAX_CALLS_PER_SECOND = 3;
const BACK_OFF_TIME = 1000 / MAX_CALLS_PER_SECOND;
exports.BACK_OFF_TIME = BACK_OFF_TIME;
exports.default = axios;
