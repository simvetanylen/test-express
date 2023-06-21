import {DomainEvent} from "../custom/decorators/domain-event";


@DomainEvent('articles/created')
export class ArticleCreated {
    id: string


    constructor(id: string) {
        this.id = id;
    }
}

@DomainEvent('articles/deleted')
export class ArticleDeleted {
    id: string

    constructor(id: string) {
        this.id = id;
    }
}