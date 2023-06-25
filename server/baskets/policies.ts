import {ArticleCreated, ArticleDeleted} from "../articles/domain-events";
import {EventHandler, EventService} from "../ivory/application-event/decorators";
import {BasketsService} from "./baskets-service";
import {RemoveArticle} from "./commands";


@EventService()
export class BasketPolicies {
    constructor(private readonly basketService: BasketsService) {
    }

    @EventHandler()
    public onArticleCreated(event: ArticleCreated) {
        console.log('it worked !')
        console.log(event)
    }

    @EventHandler()
    public async onArticleDeleted(event: ArticleDeleted) {
        (await this.basketService.findBasketsWithArticle(event.id))
            .forEach((basket) => {
                this.basketService.removeArticle(basket.id, new RemoveArticle(event.id))
            })
    }
}