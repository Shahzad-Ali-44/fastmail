export interface IRegisterBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ILoginBody {
    email: string;
    password: string;
}