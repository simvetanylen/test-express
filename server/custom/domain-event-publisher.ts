import EventEmitter from "events";
import {eventEmitter} from "../event-emitter";
import {DOMAIN_EVENT_METADATA} from "./constants";

export class DomainEventPublisher {

    private eventEmitter: EventEmitter

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    public publish(event: any) {
        const eventName = Reflect.getMetadata(DOMAIN_EVENT_METADATA, event.constructor)
        eventEmitter.emit(eventName, event)
    }
}