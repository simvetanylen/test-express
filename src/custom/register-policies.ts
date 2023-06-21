import EventEmitter from "events";
import {POLICIES_METADATA} from "./constants";

export function registerPolicies(eventEmitter: EventEmitter, policyHolder: object) {
    const targets = Reflect.getMetadata(POLICIES_METADATA, policyHolder) as {
        method: string,
        eventName: string
    }[];

    targets.forEach((target) => {
        eventEmitter.addListener(target.eventName, (event: any) => {
            policyHolder[target.method](event)
        })
    })
}