import {ContractValidationException, UnauthenticatedException, UnauthorizedException} from "./exceptions";
import {ClassConstructor} from "class-transformer";

export abstract class RestExceptionHandler<EXCEPTION> {
    constructor(readonly type: ClassConstructor<EXCEPTION>) {
    }

    canHandle(ex: any): boolean {
        return ex instanceof this.type
    }

    abstract handle(exception: EXCEPTION): { status: number, response: any }
}

export class UnauthenticatedExceptionHandler extends RestExceptionHandler<UnauthenticatedException> {
    handle(exception: UnauthenticatedException): { status: number; response: any } {
        return {
            response: {
                message: 'Unauthenticated'
            },
            status: 401
        };
    }
}

export class UnauthorizedExceptionHandler extends RestExceptionHandler<UnauthorizedException> {
    handle(exception: UnauthorizedException): { status: number; response: any } {
        return {
            response: {
                message: 'Unauthorized'
            },
            status: 403
        }
    }
}

export class ContractValidationExceptionHandler extends RestExceptionHandler<ContractValidationException> {
    handle(exception: ContractValidationException): { status: number; response: any } {
        const contractValidationException = exception as ContractValidationException

        return {
            response: {
                errors: contractValidationException.validationErrors
            },
            status: 400
        }
    }

}