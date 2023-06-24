import {ClassAnnotation, MethodAnnotation, MethodParamAnnotation} from "../annotation/annotation";
import {HttpMethod} from "./http-method";
import {
    BodyAnnotation,
    HeaderAnnotation,
    PathParamAnnotation,
    QueryParamAnnotation,
    RequestMappingAnnotation, RestControllerAnnotation
} from "./annotations";

export const Get = (path: string) => MethodAnnotation(new RequestMappingAnnotation('GET', path))
export const Post = (path: string) => MethodAnnotation(new RequestMappingAnnotation('POST', path))
export const Patch = (path: string) => MethodAnnotation(new RequestMappingAnnotation('PATCH', path))
export const Put = (path: string) => MethodAnnotation(new RequestMappingAnnotation('PUT', path))
export const Delete = (path: string) => MethodAnnotation(new RequestMappingAnnotation('DELETE', path))

export const PathParam = (paramName: string) => MethodParamAnnotation(new PathParamAnnotation(paramName))
export const QueryParam = (paramName: string) => MethodParamAnnotation(new QueryParamAnnotation(paramName))
export const Body = () => MethodParamAnnotation(new BodyAnnotation())
export const Header = (headerName: string) => MethodParamAnnotation(new HeaderAnnotation(headerName))

export const RestController = (path: string) => ClassAnnotation(new RestControllerAnnotation(path))