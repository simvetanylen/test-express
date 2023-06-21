import {ContractValidationException, UnauthenticatedException, UnauthorizedException} from "../exceptions/exceptions";

export interface ExceptionHandler {
    canHandle(exception: any): boolean
    handle(exception: any): {
        status: number,
        response: any
    }
}

export class UnauthenticatedExceptionHandler implements ExceptionHandler {

    canHandle(exception: any): boolean {
        return exception instanceof UnauthenticatedException
    }

    handle(exception: any): { status: number; response: any } {
        return {
            response: {
                message: 'Unauthenticated'
            },
            status: 401
        };
    }
}

export class UnauthorizedExceptionHandler implements ExceptionHandler {

    canHandle(exception: any): boolean {
        return exception instanceof UnauthorizedException
    }

    handle(exception: any): { status: number; response: any } {
        return {
            response: {
                message: 'Unauthorized'
            },
            status: 403
        }
    }
}

export class ContractValidationExceptionHandler implements ExceptionHandler {

    canHandle(exception: any): boolean {
        return exception instanceof ContractValidationException
    }

    handle(exception: any): { status: number; response: any } {
        const contractValidationException = exception as ContractValidationException

        return {
            response: {
                errors: contractValidationException.validationErrors
            },
            status: 400
        }
    }

}