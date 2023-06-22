import {Request, RequestHandler, Router} from "express";
import {HttpMethod} from "../ivory/rest/http-method";
import {Annotations} from "../ivory/annotation/annotation";
import {RequestMappingAnnotation} from "../ivory/rest/annotations";
import {createParameterResolutionFunction} from "../ivory/parameter-resolver/parameter-resolver";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, SessionResolverFactory
} from "../ivory/rest/parameter-resolvers";
import {
    ContractValidationExceptionHandler,
    UnauthenticatedExceptionHandler,
    UnauthorizedExceptionHandler
} from "../ivory/rest/exception-handlers";

const factories = [
    new BodyResolverFactory(),
    new PathParamResolverFactory(),
    new QueryParamResolverFactory(),
    new SessionResolverFactory(),
    new HeaderResolverFactory(),
]

const exceptionHandlers = [
    new UnauthenticatedExceptionHandler(),
    new UnauthorizedExceptionHandler(),
    new ContractValidationExceptionHandler()
]

export function transformToExpressRouter(webservices: Object): Router {
    const router = Router()

    Reflect.ownKeys(Object.getPrototypeOf(webservices)).forEach((key) => {
        if (typeof key === "string") {
            const requestMapping = Annotations.Method.first(RequestMappingAnnotation, webservices.constructor, key)

            if (requestMapping) {
                const resolutionFunction = createParameterResolutionFunction<Request>(factories, webservices, key)

                const handler: RequestHandler = async (req, res): Promise<void> => {
                    try {
                        const args = await resolutionFunction(req)
                        const targetMethod = webservices[key].bind(webservices)

                        const result = await (targetMethod(...args))
                        res.json(result)
                    } catch (e: any) {
                        const exceptionHandler = exceptionHandlers.find((handler) => handler.canHandle(e))

                        if (exceptionHandler) {
                            const result = exceptionHandler.handle(e)
                            res.status(result.status)
                            res.json(result.response)
                        } else {
                            console.error(e)
                            res.status(500)
                            res.json({
                                "message": "Internal Server Error"
                            })
                        }
                    }
                }

                switch (requestMapping.method) {
                    case HttpMethod.GET:
                        router.get(requestMapping.path, handler)
                        break
                    case HttpMethod.PUT:
                        router.put(requestMapping.path, handler)
                        break
                    case HttpMethod.POST:
                        router.post(requestMapping.path, handler)
                        break
                    case HttpMethod.PATCH:
                        router.patch(requestMapping.path, handler)
                        break
                    case HttpMethod.DELETE:
                        router.delete(requestMapping.path, handler)
                        break
                }
            }
        }
    })

    return router
}
