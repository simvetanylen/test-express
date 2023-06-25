import "reflect-metadata";
import {ClassConstructor} from "class-transformer";

const IVORY_ANNOTATIONS = 'ivory:annotations'


export interface IvoryAnnotationsModel {
    classAnnotations: {
        classType: any,
        value: any
    }[],
    methodsAnnotations: {
        [methodName: string]: {
            classType: any,
            value: any
        }[]
    }
    parametersAnnotations: {
        [methodeName: string]: {
            [parameterIndex: number]: {
                classType: any,
                value: any
            }[]
        }
    }
}

export class Annotations {

    static Class = class {
        static annotate<T extends Object>(annotation: T, classReference: Object) {
            let metadata = Annotations.getAnnotations(classReference)

            metadata.classAnnotations.push({
                classType: annotation.constructor,
                value: annotation
            })

            Annotations.setAnnotations(classReference, metadata)
        }

        static first<T>(annotationType: typeof T, classReference: Object): T | undefined {
            const metadata = Reflect.getMetadata(IVORY_ANNOTATIONS, classReference) as IvoryAnnotationsModel

            if (!metadata?.classAnnotations) {
                return undefined
            }

            return metadata.classAnnotations
                ?.find(ann => ann.classType == annotationType)?.value as T | undefined
        }
    }

    static Method = class {
        static annotate<T extends Object>(annotation: T, classReference: Object, methodName: string) {
            if (methodName === 'constructor') {
                throw Error('Constructor not supported')
            }

            let metadata = Annotations.getAnnotations(classReference)

            if (!metadata.methodsAnnotations[methodName]) {
                metadata.methodsAnnotations[methodName] = []
            }

            metadata.methodsAnnotations[methodName].push({
                classType: annotation.constructor,
                value: annotation
            })
            Annotations.setAnnotations(classReference, metadata)
        }

        static first<T>(annotationType: typeof T, classReference: Object, methodName: string): T | undefined {
            if (methodName === 'constructor') {
                return undefined
            }

            const metadata = Reflect.getMetadata(IVORY_ANNOTATIONS, classReference) as IvoryAnnotationsModel

            if (!metadata?.methodsAnnotations) {
                return undefined
            }

            if (!metadata.methodsAnnotations[methodName]) {
                return undefined
            }

            return metadata.methodsAnnotations[methodName]
                ?.find(ann => ann.classType == annotationType)?.value as T | undefined
        }
    }

    static MethodParam = class {
        static annotate<T extends Object>(annotation: T, classReference: Object, methodName: string, parameterIndex: number) {
            if (methodName === 'constructor') {
                throw Error('Constructor not supported')
            }

            let metadata = Annotations.getAnnotations(classReference)

            if (!metadata.parametersAnnotations[methodName]) {
                metadata.parametersAnnotations[methodName] = {}
            }

            if (!metadata.parametersAnnotations[methodName][parameterIndex]) {
                metadata.parametersAnnotations[methodName][parameterIndex] = []
            }

            metadata.parametersAnnotations[methodName][parameterIndex].push({
                classType: annotation.constructor,
                value: annotation
            })

            Annotations.setAnnotations(classReference, metadata)
        }

        static first<T>(annotationType: typeof T, classReference: Object, methodName: string, parameterIndex: number): T | undefined {
            if (methodName === 'constructor') {
                return undefined
            }

            const metadata = Reflect.getMetadata(IVORY_ANNOTATIONS, classReference) as IvoryAnnotationsModel

            if (!metadata.parametersAnnotations[methodName]?.[parameterIndex]) {
                return undefined
            }

            return metadata.parametersAnnotations[methodName]
                ?.[parameterIndex]
                ?.find(ann => ann.classType == annotationType)?.value as T | undefined
        }
    }

    private static getAnnotations(classReference: Object): IvoryAnnotationsModel {
        return Reflect.getMetadata(IVORY_ANNOTATIONS, classReference) || {
            classAnnotations: [],
            methodsAnnotations: {},
            parametersAnnotations: {}
        }
    }

    private static setAnnotations(classReference: Object, annotations: IvoryAnnotationsModel) {
        Reflect.defineMetadata(IVORY_ANNOTATIONS, annotations, classReference)
    }
}

export function ClassAnnotation(annotation: Object) {
    return function <T>(target: ClassConstructor<T>) {
        Annotations.Class.annotate(annotation, target)
    }
}

export function MethodAnnotation(annotation: Object) {
    return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<(...args: any) => any>) {
        Annotations.Method.annotate(annotation, target.constructor, key)
        return descriptor
    }
}

export function MethodParamAnnotation(annotation: Object) {
    return function (target: Object, propertyKey: string, parameterIndex: number) {
        Annotations.MethodParam.annotate(annotation, target.constructor, propertyKey, parameterIndex)
    }
}