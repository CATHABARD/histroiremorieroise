export class Message {
    constructor(public date: Date,
                public email: string,
                public texte: string,
                public lu: boolean,
                public id: string) { }
}
