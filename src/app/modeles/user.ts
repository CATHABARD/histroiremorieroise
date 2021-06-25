export class User {
    constructor(public id?: string,
                public uid?: string,
                public nom?: string,
                public prenom?: string,
                public email?: string,
                public emailVerified?: boolean,
                public status?: number) {
    }
}
