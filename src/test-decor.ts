import "reflect-metadata";
import {ArticleDeleted} from "./articles/domain-events";
import {DOMAIN_EVENT_METADATA} from "./custom/constants";
import {Policy} from "./custom/decorators/policy";
import {HttpMethod} from "./ivory/rest/http-method";
import {MonObject} from "./test1/MonObject";
import {MonObject as MonObject2} from './test2/MonObject'


const obj = new MonObject()



console.log(obj instanceof MonObject2)