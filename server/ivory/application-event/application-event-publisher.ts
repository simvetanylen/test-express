import EventEmitter from "events";
import {Annotations} from "../core/annotation";
import {ApplicationEventAnnotation} from "./annotations";

export class ApplicationEventPublisher {

    constructor(private readonly eventEmitter: EventEmitter) {
    }

    public publish(event: any) {
        const annotation = Annotations.Class.first(ApplicationEventAnnotation, event.constructor)
        if (annotation === undefined) {
            throw Error('Events must be annotated')
        }
        this.eventEmitter.emit(annotation.eventName, event)
    }
}