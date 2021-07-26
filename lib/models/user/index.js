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
var _User_id, _User_name, _User_avatar, _User_email;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const api_1 = __importStar(require("../../utils/api"));
class User {
    constructor(id, name, avatar, email) {
        _User_id.set(this, void 0);
        _User_name.set(this, void 0);
        _User_avatar.set(this, void 0);
        _User_email.set(this, void 0);
        __classPrivateFieldSet(this, _User_id, id, "f");
        __classPrivateFieldSet(this, _User_name, name, "f");
        __classPrivateFieldSet(this, _User_avatar, avatar, "f");
        __classPrivateFieldSet(this, _User_email, email, "f");
    }
    get id() {
        return __classPrivateFieldGet(this, _User_id, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _User_name, "f");
    }
    get avatar() {
        return __classPrivateFieldGet(this, _User_avatar, "f");
    }
    get email() {
        return __classPrivateFieldGet(this, _User_email, "f");
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let hasMore = false;
            let nextCursor = '';
            const users = [];
            do {
                const nextCursorParam = hasMore
                    ? `?start_cursor=${nextCursor}`
                    : '';
                const response = yield api_1.default.get(`/users${nextCursorParam}`);
                const results = response.data.results;
                users.push(...results.map((result) => result.person
                    ? new User(result.id, result.name, result.avatar_url, result.person.email)
                    : new User(result.id, result.name, result.avatar_url)));
            } while (hasMore);
            return users;
        });
    }
    static get(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let retries = 0;
            let user = null;
            do {
                try {
                    const response = yield api_1.default.get(`/users/${userId}`);
                    const result = response.data;
                    if (result.person) {
                        user = new User(result.id, result.name, result.avatar_url, result.person.email);
                    }
                    else {
                        user = new User(result.id, result.name, result.avatar_url);
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
                        break;
                    }
                    retries++;
                }
            } while (!user);
            if (!user) {
                throw new Error(`User ${userId} does not exist.`);
            }
            return user;
        });
    }
}
exports.User = User;
_User_id = new WeakMap(), _User_name = new WeakMap(), _User_avatar = new WeakMap(), _User_email = new WeakMap();
