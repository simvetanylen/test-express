import "reflect-metadata";
import {HttpMethod} from "./ivory/rest/http-method";
import {RequestMappingAnnotation} from "./ivory/rest/annotations";
import {Collection, Document, MongoClient, ObjectId} from "mongodb";
import {plainToClass, plainToInstance, Transform} from "class-transformer";
import {OptimisticRepository, VersionedDocument} from "./ivory/orm/optimistic-repository";
import {Article} from "./articles/article";
import {ArticleRepository} from "./articles/article-repository";

// @WithClassId
// class RequestMapping {
//     method: HttpMethod
//     path: string
//
//     constructor(method: HttpMethod, path: string) {
//         this.method = method;
//         this.path = path;
//     }
// }
//
// const articleService = new ArticleService()
// const webservices = new ArticlesWebservices(articleService)
//
// const bodyParamFact = new BodyParameterResolverFactory()
//
// const factories = [
//     new BodyParameterResolverFactory(),
//     new PathParamResolverFactory()
// ]
//
// const res = bodyParamFact.build(webservices, 'createArticle', 0)
// console.log(res)
//
// createParameterResolver(factories, webservices, 'createArticle', 0)
// createParameterResolutionFunction(factories, webservices, 'createArticle')


const client = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
const db = client.db('test')
const collection = db.collection('articles')

const repo = new ArticleRepository(collection, Article)

// repo.create({
//     name: 'test'
// }).then(res => {
//     console.log(res)
// })

repo.findOne('64920af09bf5abba8e80d8dc').then(res => {
    console.log(res)

    res.description = 'added desc'

    repo.update(res).then(res2 => {
        console.log(res2)
    }).catch(err => {
        console.log(err)
    })
})
