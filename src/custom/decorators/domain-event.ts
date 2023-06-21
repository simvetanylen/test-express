import "reflect-metadata";

import {DOMAIN_EVENT_METADATA} from "../constants";

export function DomainEvent<T extends { new (...args: any[]): {} }>(eventName: string) {
    return function <T extends { new (...args: any[]): {} }>(target: T): T {
        Reflect.defineMetadata(DOMAIN_EVENT_METADATA, eventName, target);
        return target
    };
}