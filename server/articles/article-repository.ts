import {OptimisticRepository} from "../ivory/orm/optimistic-repository";
import {Article} from "./article";
import {Collection, MongoClient} from "mongodb";
import {Injectable} from "../ivory/container/ivory-container";

@Injectable()
export class ArticleRepository extends OptimisticRepository<Article> {

    constructor(client: MongoClient) {
        super(client.db('test').collection('articles'), Article);
    }
}