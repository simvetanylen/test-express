import {OptimisticRepository} from "../ivory/orm/optimistic-repository";
import {Article} from "./article";
import {Collection} from "mongodb";
import {Injectable} from "../ivory/container/ivory-container";

@Injectable()
export class ArticleRepository extends OptimisticRepository<Article> {

    constructor(collection: Collection, ctor: any) {
        super(collection, ctor);
    }
}