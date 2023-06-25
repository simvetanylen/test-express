import {IvoryModule} from "../core/ivory-application";
import EventEmitter from "events";
import {IvoryContainer} from "../core/ivory-container";
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

                    if (annotation) {
                        const paramType = Reflect.getMetadata('design:paramtypes', beanDef.bean, key)[0]
                        const eventAnnotation = Annotations.Class.first(ApplicationEventAnnotation, paramType)
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