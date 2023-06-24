import {Request, RequestHandler, Router} from "express";
import {HttpMethod} from "../ivory/rest/http-method";
import {Annotations} from "../ivory/annotation/annotation";
import {RequestMappingAnnotation, RestControllerAnnotation} from "../ivory/rest/annotations";
import {createParameterResolutionFunction} from "../ivory/parameter-resolver/parameter-resolver";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, RestParameterResolverFactory, SessionResolverFactory
} from "../ivory/rest/parameter-resolvers";
import {
    ContractValidationExceptionHandler, RestExceptionHandler,
    UnauthenticatedExceptionHandler,
    UnauthorizedExceptionHandler
} from "../ivory/rest/exception-handlers";
import {IvoryContainer} from "../ivory/container/ivory-container";



export function transformToExpressRouter(container: IvoryContainer, webservices: Object, annotation: RestControllerAnnotation): Router {
    const paramFactories = container.getBeans(RestParameterResolverFactory)
    const exceptionHandlers = container.getBeans(RestExceptionHandler)

    const classRouter = Router({ mergeParams: true })

    Reflect.ownKeys(Object.getPrototypeOf(webservices)).forEach((key) => {
        if (typeof key === "string") {
            const requestMapping = Annotations.Method.first(RequestMappingAnnotation, webservices.constructor, key)

            if (requestMapping) {
                const resolutionFunction = createParameterResolutionFunction<Request>(paramFactories, webservices, key)

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

                const methodRouter = Router({ mergeParams: true })
                methodRouter.route(requestMapping.path)

                switch (requestMapping.method) {
                    case HttpMethod.GET:
                        methodRouter.get(requestMapping.path, handler)
                        break
                    case HttpMethod.PUT:
                        methodRouter.put(requestMapping.path, handler)
                        break
                    case HttpMethod.POST:
                        methodRouter.post(requestMapping.path, handler)
                        break
                    case HttpMethod.PATCH:
                        methodRouter.patch(requestMapping.path, handler)
                        break
                    case HttpMethod.DELETE:
                        methodRouter.delete(requestMapping.path, handler)
                        break
                }

                classRouter.use(annotation.path, methodRouter)
            }
        }
    })

    return classRouter
}
