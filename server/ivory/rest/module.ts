import {IvoryModule} from "../core/ivory-application";
import sessions, {SessionOptions} from "express-session";
import {IvoryContainer} from "../container/ivory-container";
import {
    BodyResolverFactory, HeaderResolverFactory,
    PathParamResolverFactory,
    QueryParamResolverFactory, RestParameterResolverFactory,
    SessionResolverFactory
} from "./parameter-resolvers";
import {
    ContractValidationExceptionHandler, RestExceptionHandler,
    UnauthenticatedExceptionHandler,
    UnauthorizedExceptionHandler
} from "./exception-handlers";
import {ContractValidationException, UnauthenticatedException, UnauthorizedException} from "../exceptions/exceptions";
import express, {Request, RequestHandler, Router} from "express";
import cookieParser from "cookie-parser";
import {RequestMappingAnnotation, RestControllerAnnotation} from "./annotations";
import {Annotations} from "../annotation/annotation";
import {createParameterResolutionFunction} from "../parameter-resolver/parameter-resolver";
import {HttpMethod} from "./http-method";
import cors from 'cors'

export interface RestModuleConfiguration {
    port: number
    staticFiles?: string
    basePath: string
    sessions?: {
        enabled: boolean
    } & SessionOptions
    cors?: {
        enabled: boolean
        allowedOrigins?: string[]
    }
}

export class RestModule implements IvoryModule {

    constructor(private readonly configuration: RestModuleConfiguration) {}

    setup(container: IvoryContainer): void {
        container.register(
            BodyResolverFactory,
            PathParamResolverFactory,
            QueryParamResolverFactory,
            HeaderResolverFactory
        )

        if (this.configuration.sessions?.enabled) {
            container.register(SessionResolverFactory)
        }

        container.registerInstance(new UnauthenticatedExceptionHandler(UnauthenticatedException))
        container.registerInstance(new UnauthorizedExceptionHandler(UnauthorizedException))
        container.registerInstance(new ContractValidationExceptionHandler(ContractValidationException))
    }

    start(container: IvoryContainer): void {
        const server = express();
        server.use(express.json())

        if (this.configuration.cors?.enabled) {
            const corsConfig = {
                origin: this.configuration.cors.allowedOrigins
            }

            server.use(cors(corsConfig))
            server.options('*', cors(corsConfig))
        }

        if (this.configuration.sessions?.enabled) {
            server.use(sessions(this.configuration.sessions))
            server.use(cookieParser())
        }

        if (this.configuration.staticFiles !== undefined) {
            server.use(express.static(this.configuration.staticFiles))
        }

        const paramFactories = container.getBeans(RestParameterResolverFactory)
        const exceptionHandlers = container.getBeans(RestExceptionHandler)
        const restControllers = container.getBeansByClassAnnotation(RestControllerAnnotation)

        for (let restController of restControllers) {
            // server.use(this.configuration.basePath, transformToExpressRouter(container, restController.bean, restController.annotation as RestControllerAnnotation)))
            server.use(this.configuration.basePath, RestModule.transformClass(restController.annotation.path, restController.bean, paramFactories, exceptionHandlers))
        }

        server.listen(
            this.configuration.port,
            () => {
                console.log(`Listening: http://localhost:${this.configuration.port}`);
            }
        )
    }

    private static transformClass(
        classPath: string,
        instance: Object,
        paramFactories: RestParameterResolverFactory[],
        exceptionHandlers: RestExceptionHandler<any>[]
    ): Router {
        const classRouter = Router({ mergeParams: true })

        Reflect.ownKeys(Object.getPrototypeOf(instance)).forEach((key) => {
            if (typeof key === "string") {
                const requestMapping = Annotations.Method.first(RequestMappingAnnotation, instance.constructor, key)

                if (requestMapping) {
                    const methodRouter = this.tranformMethod(instance, key, requestMapping, paramFactories, exceptionHandlers)
                    classRouter.use(classPath, methodRouter)
                }
            }
        })

        return classRouter
    }

    private static tranformMethod(
        instance: Object,
        methodName: string,
        requestMapping: RequestMappingAnnotation,
        paramFactories: RestParameterResolverFactory[],
        exceptionHandlers: RestExceptionHandler<any>[],
    ) {
        const resolutionFunction = createParameterResolutionFunction<Request>(paramFactories, instance, methodName)

        const handler: RequestHandler = async (req, res): Promise<void> => {
            try {
                const args = await resolutionFunction(req)
                const targetMethod = instance[methodName].bind(instance)

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
            case 'GET':
                methodRouter.get(requestMapping.path, handler)
                break
            case 'PUT':
                methodRouter.put(requestMapping.path, handler)
                break
            case 'POST':
                methodRouter.post(requestMapping.path, handler)
                break
            case 'PATCH':
                methodRouter.patch(requestMapping.path, handler)
                break
            case 'DELETE':
                methodRouter.delete(requestMapping.path, handler)
                break
        }

        return methodRouter
    }
}