declare class User {
    #private;
    constructor(id: string, name: string, avatar: string, email?: string);
    get id(): string;
    get name(): string;
    get avatar(): string;
    get email(): string | undefined;
    get object(): {
        id: string;
        name: string;
        avatar: string;
        email: string | undefined;
    };
    static getAll(): Promise<User[]>;
    static get(userId: string): Promise<User>;
}
export { User };
