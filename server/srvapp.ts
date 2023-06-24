import express, { Request, Response } from 'express';
import sessions from 'express-session'
import cookieParser from "cookie-parser";
import {BasketsWebservices} from "./baskets/baskets-webservices"
import {ArticlesWebservices} from "./articles/articles-webservices";
import {ArticleService} from "./articles/article-service";
import {transformToExpressRouter} from "./custom/transform-to-express-router";
import {AuthenticationWebservices} from "./authentication/authentication-webservices";
import {MongoClient} from "mongodb";
import {ArticleRepository} from "./articles/article-repository";
import {Article} from "./articles/article";
import {IvoryContainer} from "./ivory/container/ivory-container";
import path from "path";
import fs from "fs";
import ReactDOMServer from 'react-dom/server';
import App from "../react-app/App";
import React from "react";
import {RestControllerAnnotation} from "./ivory/rest/annotations";
import {BasketsService} from "./baskets/baskets-service";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, SessionResolverFactory
} from "./ivory/rest/parameter-resolvers";
import {
    ContractValidationExceptionHandler,
    UnauthenticatedExceptionHandler,
    UnauthorizedExceptionHandler
} from "./ivory/rest/exception-handlers";
import {
    ContractValidationException,
    UnauthenticatedException,
    UnauthorizedException
} from "./ivory/exceptions/exceptions";

const srvapp = express();

srvapp.use(express.json());

const mongoClient = new MongoClient('mongodb://root:root@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
const mongoDb = mongoClient.db('test')

const container = new IvoryContainer()
container.register(
    BodyResolverFactory, PathParamResolverFactory, QueryParamResolverFactory,
    SessionResolverFactory, HeaderResolverFactory
)
container.registerInstance(new UnauthenticatedExceptionHandler(UnauthenticatedException))
container.registerInstance(new UnauthorizedExceptionHandler(UnauthorizedException))
container.registerInstance(new ContractValidationExceptionHandler(ContractValidationException))
container.registerInstance(new ArticleRepository(mongoDb.collection('articles'), Article))
container.register(ArticleService, ArticlesWebservices)
container.register(AuthenticationWebservices)
container.register(BasketsService, BasketsWebservices)


srvapp.use(sessions({
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

srvapp.use(cookieParser())
srvapp.use(express.static('./dist/static'));


for (let beanDef of container.getBeansByClassAnnotation(RestControllerAnnotation)) {
    srvapp.use('/api', transformToExpressRouter(container, beanDef.bean, beanDef.annotation as RestControllerAnnotation))
}


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

export default srvapp;