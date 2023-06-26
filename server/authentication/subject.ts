import {AbstractSubject} from "../ivory/rest/abstract-subject";


export class MySubject extends AbstractSubject {
    constructor(
        readonly authenticated: boolean,
        readonly permissions: string[],
        readonly userId?: string,
    ) {
        super(authenticated, permissions);
    }
}