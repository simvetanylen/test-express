import "reflect-metadata";
import {ClassConstructor} from "class-transformer";
import {Annotations} from "../annotation/annotation";

export function Injectable() {
    return function <T>(target: ClassConstructor<T>) {}
}

export class IvoryContainer {

    private instances: Map<ClassConstructor<any>, (() => any) | undefined> = new Map()

    public register(...types: ClassConstructor<any>[]) {
        for (let type of types) {
            if (!this.instances.has(type)) {
                this.instances.set(type, undefined)
            }
        }
    }

    public registerInstance(instance: any) {
        this.instances.set(instance.constructor, () => {
            return instance
        })
    }

    public getBeansByClassAnnotation<ANNOTATION>(annotationType: typeof ANNOTATION): {
        annotation: ANNOTATION,
        bean: Object
    }[] {
        const result = []

        for (let classRef of this.instances.keys()) {
            const annotation = Annotations.Class.first(annotationType, classRef)
            if (annotation !== undefined) {
                const bean = this.getBean(classRef)

                result.push({
                    annotation: annotation as ANNOTATION,
                    bean: bean
                })
            }
        }

        return result
    }

    public getBean<BEAN>(type: ClassConstructor<BEAN>): BEAN {
        if (!this.instances.has(type)) {
            throw 'Instance not registered'
        }

        let factory = this.instances.get(type)

        if (factory !== undefined) {
            return factory()
        }

        let constructorParameters = []

        const paramTypes = Reflect.getMetadata('design:paramtypes', type)
        if (paramTypes) {
            for (let paramType of paramTypes) {
                constructorParameters.push(this.getBean(paramType))
            }
        }

        const instance = new type(...constructorParameters)

        factory = () => {
            return instance
        }

        this.instances.set(type, factory)

        return instance
    }
}