import {ArticleCreated, ArticleDeleted} from "../articles/domain-events";
import {Policy} from "../custom/decorators/policy";
import {BasketsService} from "./baskets-service";
import {RemoveArticle} from "./commands";


export class BasketPolicies {
    basketService: BasketsService

    constructor(basketService: BasketsService) {
        this.basketService = basketService;
    }

    @Policy
    public onArticleCreated(event: ArticleCreated) {
        console.log('it worked !')
        console.log(event)
    }

    @Policy
    public async onArticleDeleted(event: ArticleDeleted) {
        (await this.basketService.findBasketsWithArticle(event.id))
            .forEach((basket) => {
                this.basketService.removeArticle(basket.id, new RemoveArticle(event.id))
            })
    }
}