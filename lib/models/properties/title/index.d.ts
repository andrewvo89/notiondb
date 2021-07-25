declare class Title {
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
export default Title;
