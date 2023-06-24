import {eventEmitter} from "./event-emitter";
import {registerPolicies} from "./custom/register-policies";
import {BasketPolicies} from "./baskets/policies";
import {BasketsService} from "./baskets/baskets-service";
import {MongoClient} from "mongodb";
import {IvoryApplication} from "./ivory/core/ivory-application";
import {RestModule} from "./ivory/rest/module";
import sessions from "express-session";
import {ArticleRepository} from "./articles/article-repository";
import {Article} from "./articles/article";
import {ArticleService} from "./articles/article-service";
import {ArticlesWebservices} from "./articles/articles-webservices";
import {AuthenticationWebservices} from "./authentication/authentication-webservices";
import {BasketsWebservices} from "./baskets/baskets-webservices";

const port = 3000;

const basketService = new BasketsService()

const basketPolicies = new BasketPolicies(basketService)

registerPolicies(eventEmitter, basketPolicies)

const mongoClient = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
const mongoDb = mongoClient.db('test')


new IvoryApplication()
    .registerModule(new RestModule({
        port: 3000,
        basePath: '/api',
        staticFiles: './dist/static',
        sessions: {
            enabled: true,
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
        }
    }))
    .registerInstance(new ArticleRepository(mongoDb.collection('articles'), Article))
    .registerBeans(ArticleService, ArticlesWebservices)
    .registerBeans(AuthenticationWebservices)
    .registerBeans(BasketsService, BasketsWebservices)
    .start()

// srvapp.get('/', (req, res) => {
//     const app = ReactDOMServer.renderToString(React.createElement(App));
//     const indexFile = path.resolve('./dist/static/index.html');
//
//     fs.readFile(indexFile, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Something went wrong:', err);
//             return res.status(500).send('Oops, better luck next time!');
//         }
//
//         // return res.send(data)
//         return res.send(
//             data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
//         );
//     });
// });