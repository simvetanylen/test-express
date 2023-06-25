import {ApplicationEvent} from "../ivory/application-event/decorators";


@ApplicationEvent('articles/created')
export class ArticleCreated {
    id: string


    constructor(id: string) {
        this.id = id;
    }
}

@ApplicationEvent('articles/deleted')
export class ArticleDeleted {
    id: string

    constructor(id: string) {
        this.id = id;
    }
}