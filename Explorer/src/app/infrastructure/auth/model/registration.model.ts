export interface Registration {
    name: string,
    surname: string,
    email: string,
    username: string,
    password: string,
    userRole: UserRole;
}
export enum UserRole {
    Administrator = 0,
    Author = 1,
    Tourist = 2
}