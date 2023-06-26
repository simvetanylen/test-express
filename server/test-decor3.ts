import "reflect-metadata"
import {Injectable, IvoryContainer} from "./ivory/core/container";
import {Annotations} from "./ivory/core/annotation";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, RestParameterResolverFactory, SessionResolverFactory, SubjectSessionResolverFactory
} from "./ivory/rest/parameter-resolvers";
import {ArticleRepository} from "./articles/article-repository";
import {Article} from "./articles/article";
import {ArticleService} from "./articles/article-service";
import {ArticlesWebservices} from "./articles/articles-webservices";
import {AuthenticationWebservices} from "./authentication/authentication-webservices";
import {BasketsService} from "./baskets/baskets-service";
import {BasketsWebservices} from "./baskets/baskets-webservices";
import {UnauthenticatedExceptionHandler} from "./ivory/rest/exception-handlers";
import {UnauthenticatedException} from "./ivory/rest/exceptions";
import {BasketPolicies} from "./baskets/policies";
import {ApplicationEventPublisher} from "./ivory/application-event/application-event-publisher";
import {ArticleCreated} from "./articles/domain-events";
import {EventHandlerAnnotation} from "./ivory/application-event/annotations";
import EventEmitter from "events";
import {MySubject} from "./authentication/subject";
import {createMethodParameterResolvers, createParameterResolver} from "./ivory/core/parameter-resolver";

const authWs = new AuthenticationWebservices()

const paramRes = [
    new SubjectSessionResolverFactory(MySubject)
]

createParameterResolver(
    paramRes,
    authWs,
    'getSubject',
    0
)