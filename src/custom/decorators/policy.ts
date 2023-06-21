import {DOMAIN_EVENT_METADATA, POLICIES_METADATA} from "../constants";

export function Policy<T extends {}>(
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<(event: T) => any>
) {
    const eventParam = Reflect.getMetadata("design:paramtypes", target, key)[0]
    const eventName = Reflect.getMetadata(DOMAIN_EVENT_METADATA, eventParam)
    let policies = Reflect.getMetadata(POLICIES_METADATA, target)

    if (policies == undefined) {
        policies = []
    }

    policies.push({
        method: key,
        eventName: eventName
    })

    Reflect.defineMetadata(POLICIES_METADATA, policies, target)
    return descriptor;
}
