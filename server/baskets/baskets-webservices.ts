import {BasketsService} from "./baskets-service";
import {AddArticle} from "./commands";
import {Body, Get, PathParam, Post, RestController} from "../ivory/rest/decorators";


@RestController('/baskets')
export class BasketsWebservices {
    constructor(private readonly service: BasketsService) {
    }

    @Get('/')
    public async getAll() {
        return this.service.findAll()
    }

    @Post('/')
    public async create() {
        return this.service.create()
    }

    @Post('/:id/articles')
    public async addArticle(
        @PathParam('id') id: string,
        @Body() command: AddArticle
    ) {
        return this.service.addArticle(id, command)
    }
}