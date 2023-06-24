import "reflect-metadata"
import {Injectable, IvoryContainer} from "./ivory/container/ivory-container";
import {Annotations} from "./ivory/annotation/annotation";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, RestParameterResolverFactory, SessionResolverFactory
} from "./ivory/rest/parameter-resolvers";
import {ArticleRepository} from "./articles/article-repository";
import {Article} from "./articles/article";
import {ArticleService} from "./articles/article-service";
import {ArticlesWebservices} from "./articles/articles-webservices";
import {AuthenticationWebservices} from "./authentication/authentication-webservices";
import {BasketsService} from "./baskets/baskets-service";
import {BasketsWebservices} from "./baskets/baskets-webservices";
import {UnauthenticatedExceptionHandler} from "./ivory/rest/exception-handlers";
import {UnauthenticatedException} from "./ivory/exceptions/exceptions";

const handler = new UnauthenticatedExceptionHandler(UnauthenticatedException)
const ex = new UnauthenticatedException()

console.log(handler.canHandle(ex))