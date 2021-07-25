import { DateOptions, PropertyData } from './types';
declare class Title implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        title: {
            type: string;
            text: {
                content: string;
            };
        }[];
    };
}
declare class RichText implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        rich_text: {
            type: string;
            text: {
                content: string;
            };
        }[];
    };
}
declare class Number implements PropertyData {
    #private;
    constructor(value: number);
    get notionProperty(): {
        number: number;
    };
}
declare class Select implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        select: {
            name: string;
        };
    };
}
declare class MultiSelect implements PropertyData {
    #private;
    constructor(values: string[]);
    get notionProperty(): {
        multi_select: {
            name: string;
        }[];
    };
}
declare class Date implements PropertyData {
    #private;
    constructor(start: globalThis.Date, options?: DateOptions);
    get notionProperty(): {
        date: Record<string, any>;
    };
}
declare class Checkbox implements PropertyData {
    #private;
    constructor(value: boolean);
    get notionProperty(): {
        checkbox: boolean;
    };
}
declare class URL implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        url: string;
    };
}
declare class Email implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        email: string;
    };
}
declare class PhoneNumber implements PropertyData {
    #private;
    constructor(value: string);
    get notionProperty(): {
        phone_number: string;
    };
}
export { Title, RichText, Number, Select, MultiSelect, Date, Checkbox, URL, Email, PhoneNumber, };
