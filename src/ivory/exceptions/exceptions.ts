import {ValidationError} from "class-validator";


export class UnauthenticatedException {

}

export class UnauthorizedException {

}

export class ContractValidationException {
    validationErrors: ValidationError[]

    constructor(validationErrors: ValidationError[]) {
        this.validationErrors = validationErrors;
    }
}