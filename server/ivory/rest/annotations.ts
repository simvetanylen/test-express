import {HttpMethod} from "./http-method";

export class RequestMappingAnnotation {
    method: HttpMethod
    path: string

    constructor(method: HttpMethod, path: string) {
        this.method = method;
        this.path = path;
    }
}

export class RestControllerAnnotation {

}

export class PathParamAnnotation {
    paramName: string

    constructor(paramName: string) {
        this.paramName = paramName;
    }
}

export class QueryParamAnnotation {
    paramName: string

    constructor(paramName: string) {
        this.paramName = paramName
    }
}

export class BodyAnnotation {
}

export class HeaderAnnotation {
    headerName: string

    constructor(headerName: string) {
        this.headerName = headerName
    }
}