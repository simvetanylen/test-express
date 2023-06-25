import {ClassAnnotation, MethodAnnotation} from "../core/annotation";
import {ApplicationEventAnnotation, EventHandlerAnnotation, EventServiceAnnotation} from "./annotations";

export const ApplicationEvent = (eventName: string) => ClassAnnotation(new ApplicationEventAnnotation(eventName))
export const EventHandler = () => MethodAnnotation(new EventHandlerAnnotation())
export const EventService = () => ClassAnnotation(new EventServiceAnnotation())