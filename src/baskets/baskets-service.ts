import {MongoClient, ObjectId} from "mongodb";
import {AddArticle, RemoveArticle} from "./commands";
import {plainToInstance} from "class-transformer";
import {Basket} from "./basket";

export class BasketsService {
    db: string = 'test';
    collection: string = 'baskets';
    uri: string = 'mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';

    client: MongoClient

    constructor() {
        this.client = new MongoClient(this.uri)
    }

    public async connect() {
        await this.client.connect()
    }

    public async create() {
        return await this.client
            .db(this.db)
            .collection(this.collection)
            .insertOne({
                content: []
            })
    }

    public async addArticle(id: string, command: AddArticle) {
        const doc = await this.client
            .db(this.db)
            .collection(this.collection)
            .findOne({
                _id: new ObjectId(id)
            })

        const basket = plainToInstance(Basket, doc)

        basket.content.push({
            articleRef: command.articleRef,
            quantity: command.quantity
        })

        return await this.client
            .db(this.db)
            .collection(this.collection)
            .updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {
                    content: basket.content
                }
            })
    }

    public async removeArticle(id: string, command: RemoveArticle) {
        const doc = await this.client
            .db(this.db)
            .collection(this.collection)
            .findOne({
                _id: new ObjectId(id)
            })

        const basket = plainToInstance(Basket, doc)

        basket.content = basket.content.filter((element) => {
            return element.articleRef != command.articleRef
        })

        return await this.client
            .db(this.db)
            .collection(this.collection)
            .updateOne({
                _id: new ObjectId(id)
            }, {
                $set: {
                    content: basket.content
                }
            })
    }

    public async findAll() {
        return await this.client
            .db(this.db)
            .collection(this.collection)
            .find({})
            .toArray()
    }

    public async findBasketsWithArticle(articleRef: string) {
        return (await this.client
            .db(this.db)
            .collection(this.collection)
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