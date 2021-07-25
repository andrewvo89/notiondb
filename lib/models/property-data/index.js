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
var _Title_value, _RichText_value, _Number_value, _Select_value, _MultiSelect_values, _Date_start, _Date_options, _Checkbox_value, _URL_value, _Email_value, _PhoneNumber_value;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumber = exports.Email = exports.URL = exports.Checkbox = exports.Date = exports.MultiSelect = exports.Select = exports.Number = exports.RichText = exports.Title = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
class Title {
    constructor(value) {
        _Title_value.set(this, void 0);
        __classPrivateFieldSet(this, _Title_value, value, "f");
    }
    get notionValue() {
        return {
            title: [
                {
                    type: 'text',
                    text: {
                        content: __classPrivateFieldGet(this, _Title_value, "f"),
                    },
                },
            ],
        };
    }
    static getValue(notionValue) {
        if (notionValue.title.length === 0) {
            return '';
        }
        return notionValue.title[0].text.content;
    }
}
exports.Title = Title;
_Title_value = new WeakMap();
class RichText {
    constructor(value) {
        _RichText_value.set(this, void 0);
        __classPrivateFieldSet(this, _RichText_value, value, "f");
    }
    get notionValue() {
        return {
            rich_text: [
                {
                    type: 'text',
                    text: {
                        content: __classPrivateFieldGet(this, _RichText_value, "f"),
                    },
                },
            ],
        };
    }
    static getValue(notionValue) {
        if (notionValue.rich_text.length === 0) {
            return '';
        }
        return notionValue.rich_text[0].text.content;
    }
}
exports.RichText = RichText;
_RichText_value = new WeakMap();
class Number {
    constructor(value) {
        _Number_value.set(this, void 0);
        __classPrivateFieldSet(this, _Number_value, value, "f");
    }
    get notionValue() {
        return {
            number: __classPrivateFieldGet(this, _Number_value, "f"),
        };
    }
    static getValue(notionValue) {
        return notionValue.number;
    }
}
exports.Number = Number;
_Number_value = new WeakMap();
class Select {
    constructor(value) {
        _Select_value.set(this, void 0);
        __classPrivateFieldSet(this, _Select_value, value, "f");
    }
    get notionValue() {
        return {
            select: {
                name: __classPrivateFieldGet(this, _Select_value, "f"),
            },
        };
    }
    static getValue(notionValue) {
        return notionValue.select;
    }
}
exports.Select = Select;
_Select_value = new WeakMap();
class MultiSelect {
    constructor(values) {
        _MultiSelect_values.set(this, void 0);
        __classPrivateFieldSet(this, _MultiSelect_values, values, "f");
    }
    get notionValue() {
        return {
            multi_select: __classPrivateFieldGet(this, _MultiSelect_values, "f").map((value) => ({ name: value })),
        };
    }
    static getValue(notionValue) {
        return notionValue.multi_select.map((value) => value.name);
    }
}
exports.MultiSelect = MultiSelect;
_MultiSelect_values = new WeakMap();
class Date {
    constructor(start, options) {
        _Date_start.set(this, void 0);
        _Date_options.set(this, void 0);
        __classPrivateFieldSet(this, _Date_start, start, "f");
        __classPrivateFieldSet(this, _Date_options, options, "f");
    }
    get notionValue() {
        let dateProperties = {
            start: dayjs_1.default(__classPrivateFieldGet(this, _Date_start, "f")).format('YYYY-MM-DD'),
        };
        if (__classPrivateFieldGet(this, _Date_options, "f")) {
            const { end, includeTime, timezone } = __classPrivateFieldGet(this, _Date_options, "f");
            if (end) {
                dateProperties.end = dayjs_1.default(end).format('YYYY-MM-DD');
            }
            if (timezone) {
                for (const key in dateProperties) {
                    dateProperties[key] = dayjs_1.default.tz(dateProperties[key], timezone);
                }
            }
            if (includeTime) {
                for (const key in dateProperties) {
                    const isoString = dayjs_1.default(dateProperties[key]).toISOString();
                    if (timezone) {
                        const offset = dayjs_1.default.tz(dateProperties[key], timezone).utcOffset() / 60;
                        const offsetIsoString = dayjs_1.default
                            .utc(isoString)
                            .utcOffset(offset, true)
                            .format();
                        dateProperties[key] = offsetIsoString;
                    }
                    else {
                        dateProperties[key] = isoString;
                    }
                }
            }
        }
        return {
            date: dateProperties,
        };
    }
    static getValue(notionValue) {
        const value = {
            start: new globalThis.Date(notionValue.date.start),
        };
        if (notionValue.date.end) {
            value.end = new globalThis.Date(notionValue.date.end);
        }
        return value;
    }
}
exports.Date = Date;
_Date_start = new WeakMap(), _Date_options = new WeakMap();
class Checkbox {
    constructor(value) {
        _Checkbox_value.set(this, void 0);
        __classPrivateFieldSet(this, _Checkbox_value, value, "f");
    }
    get notionValue() {
        return {
            checkbox: __classPrivateFieldGet(this, _Checkbox_value, "f"),
        };
    }
    static getValue(notionValue) {
        return notionValue.checkbox;
    }
}
exports.Checkbox = Checkbox;
_Checkbox_value = new WeakMap();
class URL {
    constructor(value) {
        _URL_value.set(this, void 0);
        __classPrivateFieldSet(this, _URL_value, value, "f");
    }
    get notionValue() {
        return {
            url: __classPrivateFieldGet(this, _URL_value, "f"),
        };
    }
    static getValue(notionValue) {
        return notionValue.url;
    }
}
exports.URL = URL;
_URL_value = new WeakMap();
class Email {
    constructor(value) {
        _Email_value.set(this, void 0);
        __classPrivateFieldSet(this, _Email_value, value, "f");
    }
    get notionValue() {
        return {
            email: __classPrivateFieldGet(this, _Email_value, "f"),
        };
    }
    static getValue(notionValue) {
        return notionValue.email;
    }
}
exports.Email = Email;
_Email_value = new WeakMap();
class PhoneNumber {
    constructor(value) {
        _PhoneNumber_value.set(this, void 0);
        __classPrivateFieldSet(this, _PhoneNumber_value, value, "f");
    }
    get notionValue() {
        return {
            phone_number: __classPrivateFieldGet(this, _PhoneNumber_value, "f"),
        };
    }
    static getValue(notionValue) {
        return notionValue.phone_number;
    }
}
exports.PhoneNumber = PhoneNumber;
_PhoneNumber_value = new WeakMap();
