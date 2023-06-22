import {CreateArticle, UpdateArticle} from "./commands";
import {ArticleService} from "./article-service";
import {validate} from "class-validator";
import {Body, Delete, Get, Header, PathParam, Post, Put, QueryParam, RestController} from "../ivory/rest/decorators";
import {Session} from "express-session";
import {Injectable} from "../ivory/container/ivory-container";

@RestController()
export class ArticlesWebservices {

    constructor(private readonly articleService: ArticleService) {
    }

    @Get('/articles')
    public async getArticles(
        @QueryParam('limit') limit: number,
        @Header('Content-Type') contentType: string,
    ) {
        console.log(contentType)
        return await this.articleService.findAll()
    }

    @Post('/articles')
    public async createArticle(
        @Body() body: CreateArticle,
        session: Session
    ) {
        return await this.articleService.create(body)
    }

    @Put('/articles/:id')
    public async updateArticle(
        @PathParam('id') id: string,
        @Body() body: UpdateArticle
    ) {
        return await this.articleService.update(id, body)
    }

    @Delete('/articles/:id')
    public async deleteArticle(
        @PathParam('id') id: string
    ) {
        return await this.articleService.delete(id)
    }
}