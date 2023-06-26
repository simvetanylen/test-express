import {IvoryModule} from "../core/application";
import EventEmitter from "events";
import {IvoryContainer} from "../core/container";
import {ApplicationEventPublisher} from "./application-event-publisher";
import {ApplicationEventAnnotation, EventHandlerAnnotation, EventServiceAnnotation} from "./annotations";
import {Annotations} from "../core/annotation";

export class ApplicationEventModule implements IvoryModule {

    private readonly eventEmitter = new EventEmitter()

    setup(container: IvoryContainer): void {
        container.registerInstance(
            new ApplicationEventPublisher(this.eventEmitter)
        )
    }

    start(container: IvoryContainer): void {
        for (let beanDef of container.getBeansByClassAnnotation(EventServiceAnnotation)) {
            Reflect.ownKeys(Object.getPrototypeOf(beanDef.bean)).forEach((key) => {
                if (typeof key === "string") {
                    const annotation = Annotations.Method.first(EventHandlerAnnotation, beanDef.bean.constructor, key)

                    if (annotation !== undefined) {
                        const paramType = Reflect.getMetadata('design:paramtypes', beanDef.bean, key)[0]
                        const eventAnnotation = Annotations.Class.first(ApplicationEventAnnotation, paramType)

                        if (eventAnnotation?.eventName === undefined) {
                            throw Error('Events should be annotated')
                        }

                        // @ts-ignore
                        const handler = beanDef.bean[key].bind(beanDef.bean)

                        this.eventEmitter.addListener(eventAnnotation.eventName, (event: any) => {
                            handler(event)
                        })
                    }
                }
            })
        }
    }

}