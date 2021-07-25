import { CheckboxNotionValue, DateNotionValue, DateOptions, EmailNotionValue, MultiSelectNotionValue, NumberNotionValue, PhoneNumberNotionValue, PropertyData, RichTextNotionValue, SelectNotionValue, TitleNotionValue, URLNotionValue } from './types';
declare class Title implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): TitleNotionValue;
    static getValue(notionValue: TitleNotionValue): string;
}
declare class RichText implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): RichTextNotionValue;
    static getValue(notionValue: RichTextNotionValue): string;
}
declare class Number implements PropertyData {
    #private;
    constructor(value: number);
    get notionValue(): NumberNotionValue;
    static getValue(notionValue: NumberNotionValue): number;
}
declare class Select implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): SelectNotionValue;
    static getValue(notionValue: SelectNotionValue): {
        name: string;
    };
}
declare class MultiSelect implements PropertyData {
    #private;
    constructor(values: string[]);
    get notionValue(): MultiSelectNotionValue;
    static getValue(notionValue: MultiSelectNotionValue): string[];
}
declare class Date implements PropertyData {
    #private;
    constructor(start: globalThis.Date, options?: DateOptions);
    get notionValue(): DateNotionValue;
    static getValue(notionValue: DateNotionValue): {
        start: globalThis.Date;
        end?: globalThis.Date | undefined;
    };
}
declare class Checkbox implements PropertyData {
    #private;
    constructor(value: boolean);
    get notionValue(): CheckboxNotionValue;
    static getValue(notionValue: CheckboxNotionValue): boolean;
}
declare class URL implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): URLNotionValue;
    static getValue(notionValue: URLNotionValue): string;
}
declare class Email implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): EmailNotionValue;
    static getValue(notionValue: EmailNotionValue): string;
}
declare class PhoneNumber implements PropertyData {
    #private;
    constructor(value: string);
    get notionValue(): PhoneNumberNotionValue;
    static getValue(notionValue: PhoneNumberNotionValue): string;
}
export { Title, RichText, Number, Select, MultiSelect, Date, Checkbox, URL, Email, PhoneNumber, };
