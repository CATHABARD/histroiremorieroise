export class Article {
    constructor(public id?: string,
        public titre?: string,
        public texte?: string,
        public idTheme?: string,
        public date?: string,
        public photo?: string,
        public photo2?: string,
        public legende?: string,
        public auteur?: string,
        public nomAuteur?: string,
        public status?: number) { }
}
