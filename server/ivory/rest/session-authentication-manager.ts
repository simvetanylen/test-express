import {AbstractSubject} from "./abstract-subject";
import {Session} from "express-session";
import {instanceToPlain} from "class-transformer";

export class SessionAuthenticationManager<SUBJECT extends AbstractSubject> {

    constructor(private readonly session: Session) {}


    public login(subject: SUBJECT) {
        // @ts-ignore
        this.session.subject = instanceToPlain(subject)
    }

    public logout() {
        this.session.destroy(() => {})
    }
}