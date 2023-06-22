import {ParameterResolver, ParameterResolverFactory} from "../parameter-resolver/parameter-resolver";
import {Request} from "express";
import {Annotations} from "../annotation/annotation";
import {BodyAnnotation, HeaderAnnotation, PathParamAnnotation, QueryParamAnnotation} from "./annotations";
import {plainToInstance} from "class-transformer";
import {Session} from "express-session";
import {validate} from "class-validator";
import {ContractValidationException} from "../exceptions/exceptions";

export class BodyResolverFactory implements ParameterResolverFactory<Request> {

    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<Request> | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const bodyAnnotation = Annotations.MethodParam.first(BodyAnnotation, instance.constructor, methodName, parameterIndex)

        if (bodyAnnotation === undefined) {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        return {
            async resolve(input: Request): any {
                const body = plainToInstance(paramType, input.body)
                const errors = await validate(body)

                if (errors.length > 0) {
                    throw new ContractValidationException(errors)
                } else {
                    return body
                }
            }
        };
    }
}

export class PathParamResolverFactory implements ParameterResolverFactory<Request> {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<Request> | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const pathParamAnnotation = Annotations.MethodParam.first(PathParamAnnotation, instance.constructor, methodName, parameterIndex)

        if (pathParamAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): any {
                return Promise.resolve(input.params[pathParamAnnotation.paramName])
            }
        };
    }
}

export class QueryParamResolverFactory implements ParameterResolverFactory<Request> {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<Request> | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const queryParamAnnotation = Annotations.MethodParam.first(QueryParamAnnotation, instance.constructor, methodName, parameterIndex)

        if (queryParamAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): any {
                return Promise.resolve(input.query[queryParamAnnotation.paramName])
            }
        };
    }
}

export class SessionResolverFactory implements ParameterResolverFactory<Request> {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<Request> | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        if (paramType !== Session) {
            return undefined
        }

        return {
            async resolve(input: Request): any {
                return Promise.resolve(input.session)
            }
        }
    }
}

export class HeaderResolverFactory implements ParameterResolverFactory<Request> {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<Request> | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const headerAnnotation = Annotations.MethodParam.first(HeaderAnnotation, instance.constructor, methodName, parameterIndex)

        if (headerAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): any {
                return Promise.resolve(input.header(headerAnnotation.headerName))
            }
        };
    }
}