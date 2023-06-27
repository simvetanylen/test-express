import {ParameterResolver, ParameterResolverFactory} from "../core/parameter-resolver";
import {Request} from "express";
import {Annotations} from "../core/annotation";
import {BodyAnnotation, HeaderAnnotation, PathParamAnnotation, QueryParamAnnotation} from "./annotations";
import {ClassConstructor, plainToInstance} from "class-transformer";
import {Session} from "express-session";
import {validate} from "class-validator";
import {ContractValidationException} from "./exceptions";
import {AbstractSubject} from "./abstract-subject";
import {SessionAuthenticationManager} from "./session-authentication-manager";

export abstract class RestParameterResolverFactory implements ParameterResolverFactory<Request> {
    public abstract build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined
}

export interface RestParameterResolver extends ParameterResolver<Request> {
    resolve(request: Request): Promise<any>
}

export class BodyResolverFactory extends RestParameterResolverFactory {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const bodyAnnotation = Annotations.MethodParam.first(BodyAnnotation, instance.constructor, methodName, parameterIndex)

        if (bodyAnnotation === undefined) {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        return {
            async resolve(input: Request): Promise<any> {
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

export class PathParamResolverFactory extends RestParameterResolverFactory {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const pathParamAnnotation = Annotations.MethodParam.first(PathParamAnnotation, instance.constructor, methodName, parameterIndex)

        if (pathParamAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): Promise<any> {
                return Promise.resolve(input.params[pathParamAnnotation.paramName])
            }
        };
    }
}

export class QueryParamResolverFactory extends RestParameterResolverFactory {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const queryParamAnnotation = Annotations.MethodParam.first(QueryParamAnnotation, instance.constructor, methodName, parameterIndex)

        if (queryParamAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): Promise<any> {
                return Promise.resolve(input.query[queryParamAnnotation.paramName])
            }
        };
    }
}

export class SessionResolverFactory extends RestParameterResolverFactory {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        if (paramType !== Session) {
            return undefined
        }

        return {
            async resolve(input: Request): Promise<Session> {
                return Promise.resolve(input.session)
            }
        }
    }
}

export class SubjectSessionResolverFactory<SUBJECT extends AbstractSubject> extends RestParameterResolverFactory {

    constructor(private readonly subjectClass: ClassConstructor<SUBJECT>) {
        super();
    }

    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        if (paramType !== this.subjectClass) {
            return undefined
        }

        const subjectClass = this.subjectClass

        return {
            async resolve(input: Request): Promise<SUBJECT> {
                const session = input.session as {
                    subject?: any
                }

                const currentSubject = session.subject || {
                    authenticated: false,
                    permissions: []
                }

                return Promise.resolve(plainToInstance(subjectClass, currentSubject))
            }
        }
    }
}

export class SessionAuthenticationManagerResolverFactory<SUBJECT extends AbstractSubject> extends RestParameterResolverFactory {

    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const paramType = Reflect.getMetadata('design:paramtypes', instance, methodName)[parameterIndex]

        if (paramType !== SessionAuthenticationManager) {
            return undefined
        }

        return {
            async resolve(input: Request): Promise<SessionAuthenticationManager<SUBJECT>> {
                return Promise.resolve(new SessionAuthenticationManager(input.session))
            }
        }
    }
}

export class HeaderResolverFactory extends RestParameterResolverFactory {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): RestParameterResolver | undefined {
        if (typeof methodName !== 'string') {
            return undefined
        }

        const headerAnnotation = Annotations.MethodParam.first(HeaderAnnotation, instance.constructor, methodName, parameterIndex)

        if (headerAnnotation === undefined) {
            return undefined
        }

        return {
            async resolve(input: Request): Promise<any> {
                return Promise.resolve(input.header(headerAnnotation.headerName))
            }
        };
    }
}