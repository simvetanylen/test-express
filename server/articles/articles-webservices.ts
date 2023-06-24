import {CreateArticle, UpdateArticle} from "./commands";
import {ArticleService} from "./article-service";
import {Body, Delete, Get, Header, PathParam, Post, Put, QueryParam, RestController} from "../ivory/rest/decorators";
import {Session} from "express-session";

@RestController('/articles')
export class ArticlesWebservices {

    constructor(private readonly articleService: ArticleService) {
    }

    @Get('/')
    public async getArticles(
        @QueryParam('limit') limit: number,
        @Header('Content-Type') contentType: string,
    ) {
        console.log(contentType)
        return await this.articleService.findAll()
    }

    @Post('/')
    public async createArticle(
        @Body() body: CreateArticle,
        session: Session
    ) {
        return await this.articleService.create(body)
    }

    @Put('/:id')
    public async updateArticle(
        @PathParam('id') id: string,
        @Body() body: UpdateArticle
    ) {
        return await this.articleService.update(id, body)
    }

    @Delete('/:id')
    public async deleteArticle(
        @PathParam('id') id: string
    ) {
        return await this.articleService.delete(id)
    }
}