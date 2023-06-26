import {Collection, MongoClient, ObjectId} from "mongodb";
import {AddArticle, RemoveArticle} from "./commands";
import {plainToInstance} from "class-transformer";
import {Basket} from "./basket";
import {Injectable} from "../ivory/core/container";

@Injectable()
export class BasketsService {
    collection: Collection

    constructor(client: MongoClient) {
        this.collection = client.db('test').collection('baskets')
    }

    public async create() {
        return await this.collection
            .insertOne({
                content: []
            })
    }

    public async addArticle(id: string, command: AddArticle) {
        const doc = await this.collection
            .findOne({
                _id: new ObjectId(id)
            })

        const basket = plainToInstance(Basket, doc)

        basket.content.push({
            articleRef: command.articleRef,
            quantity: command.quantity
        })

        return await this.collection
            .updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {
                    content: basket.content
                }
            })
    }

    public async removeArticle(id: string, command: RemoveArticle) {
        const doc = await this.collection
            .findOne({
                _id: new ObjectId(id)
            })

        const basket = plainToInstance(Basket, doc)

        basket.content = basket.content.filter((element) => {
            return element.articleRef != command.articleRef
        })

        return await this.collection
            .updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {
                    content: basket.content
                }
            })
    }

    public async findAll() {
        return await this.collection
            .find({})
            .toArray()
    }

    public async findBasketsWithArticle(articleRef: string) {
        return (await this.collection
            .find({
                content: {
                    $elemMatch: {
                        articleRef: articleRef
                    }
                }
            })
            .toArray())
            .map((it) => plainToInstance(Basket, it))
    }
}