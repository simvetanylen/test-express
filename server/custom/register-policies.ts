import EventEmitter from "events";
import {Annotations} from "../ivory/core/annotation";
import {ApplicationEventAnnotation, EventHandlerAnnotation} from "../ivory/application-event/annotations";

export function registerPolicies(eventEmitter: EventEmitter, instance: object) {
    Reflect.ownKeys(Object.getPrototypeOf(instance)).forEach((key) => {
        if (typeof key === "string") {
            const annotation = Annotations.Method.first(EventHandlerAnnotation, instance.constructor, key)

            if (annotation) {
                const paramType = Reflect.getMetadata('design:paramtypes', instance, key)[0]
                const eventAnnotation = Annotations.Class.first(ApplicationEventAnnotation, paramType)
                const handler = instance[key].bind(instance)

                eventEmitter.addListener(eventAnnotation.eventName, (event: any) => {
                    handler(event)
                })
            }
        }
    })
}