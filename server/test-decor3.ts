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
import {BasketPolicies} from "./baskets/policies";
import {registerPolicies} from "./custom/register-policies";
import {eventEmitter} from "./event-emitter";
import {ApplicationEventPublisher} from "./ivory/application-event/application-event-publisher";
import {ArticleCreated} from "./articles/domain-events";
import {EventHandlerAnnotation} from "./ivory/application-event/annotations";

const basketPolicies = new BasketPolicies()

registerPolicies(eventEmitter, basketPolicies)
//
const eventPublisher = new ApplicationEventPublisher(eventEmitter)
//
eventPublisher.publish(new ArticleCreated('test'))