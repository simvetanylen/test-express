import express, { Request, Response } from 'express';
import sessions from 'express-session'
import cookieParser from "cookie-parser";
import basketsWebservices from "./baskets/baskets-webservices"
import {ArticlesWebservices} from "./articles/articles-webservices";
import {ArticleService} from "./articles/article-service";
import {transformToExpressRouter} from "./custom/transform-to-express-router";
import authenticationWebservices from "./authentication/authentication-webservices";
import {MongoClient} from "mongodb";
import {ArticleRepository} from "./articles/article-repository";
import {Article} from "./articles/article";
import {IvoryContainer} from "./ivory/container/ivory-container";

const app = express();

app.use(express.json());

const mongoClient = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
const mongoDb = mongoClient.db('test')

const container = new IvoryContainer()
container.registerInstance(new ArticleRepository(mongoDb.collection('articles'), Article))
container.register(ArticleService, ArticlesWebservices)


app.use(sessions({
    name: 'test-session',
    secret: 'random secret to set',
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        // TODO : put true for prod, false because of localhost
        secure: false,
        httpOnly: true
    },
    resave: false,
    store: new sessions.MemoryStore()
}))

app.use(cookieParser())

app.use('/', transformToExpressRouter(container.getBean(ArticlesWebservices)))
app.use('/', basketsWebservices)
app.use('/', authenticationWebservices)

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

export default app;