import "reflect-metadata";
import {ClassConstructor} from "class-transformer";

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

    public getBean<T>(type: ClassConstructor<T>): T {
        if (!this.instances.has(type)) {
            throw 'Instance not registered'
        }

        let factory = this.instances.get(type)

        if (factory !== undefined) {
            return factory()
        }

        let constructorParameters = []

        for (let paramType of Reflect.getMetadata('design:paramtypes', type)) {
            constructorParameters.push(this.getBean(paramType))
        }

        const instance = new type(...constructorParameters)

        factory = () => {
            return instance
        }

        this.instances.set(type, factory)

        return instance
    }
}