import {CreateArticle, UpdateArticle} from "./commands";
import {ApplicationEventPublisher} from "../ivory/application-event/application-event-publisher";
import {ArticleCreated, ArticleDeleted} from "./domain-events";
import {ArticleRepository} from "./article-repository";
import {Injectable} from "../ivory/core/container";

@Injectable()
export class ArticleService {

    constructor(
        private readonly repository: ArticleRepository,
        private readonly publisher: ApplicationEventPublisher,
    ) {}

    public async create(command: CreateArticle) {
        const id = await this.repository.create({
            ...command
        })

        this.publisher.publish(new ArticleCreated(
            id.toString()
        ))

        return id
    }

    public async update(id: string, command: UpdateArticle) {
        const article = await this.repository.findOne(id)
        article.name = command.name
        article.description = command.description
        article.price = command.price

        await this.repository.update(article)

        return article
    }

    public async delete(id: string) {
        const article = await this.repository.findOne(id)
        await this.repository.delete(article)
    }

    public async findAll() {
        return this.repository.findAll({})
    }
}