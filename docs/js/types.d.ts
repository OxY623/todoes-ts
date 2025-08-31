export type ID = string | number;
export type IAddress = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
        lat: string;
        lng: string;
    };
};
export type ICompany = {
    name: string;
    catchPhrase: string;
    bs: string;
};
export interface IToDo {
    userId: ID;
    id: ID;
    title: string;
    completed: boolean;
}
export interface IUser {
    id: ID;
    name: string;
    username: string;
    email: string;
    address: IAddress;
    phone: string;
    website: string;
    company: ICompany;
}
export interface PrintToDo {
    (args: IToDo): void;
}
//# sourceMappingURL=types.d.ts.map