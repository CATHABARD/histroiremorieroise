import { Article } from './article';

export class Theme {
    constructor(
        public id?: string,
        public nom?: string,
        public status?: number,
        public articles?: Article[]) { }
}
