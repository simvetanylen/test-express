import {MethodAnnotation, MethodParamAnnotation} from "../annotation/annotation";
import {HttpMethod} from "./http-method";
import {
    BodyAnnotation,
    HeaderAnnotation,
    PathParamAnnotation,
    QueryParamAnnotation,
    RequestMappingAnnotation
} from "./annotations";

export const Get = (path: string) => MethodAnnotation(new RequestMappingAnnotation(HttpMethod.GET, path))
export const Post = (path: string) => MethodAnnotation(new RequestMappingAnnotation(HttpMethod.POST, path))
export const Patch = (path: string) => MethodAnnotation(new RequestMappingAnnotation(HttpMethod.PATCH, path))
export const Put = (path: string) => MethodAnnotation(new RequestMappingAnnotation(HttpMethod.PUT, path))
export const Delete = (path: string) => MethodAnnotation(new RequestMappingAnnotation(HttpMethod.DELETE, path))

export const PathParam = (paramName: string) => MethodParamAnnotation(new PathParamAnnotation(paramName))
export const QueryParam = (paramName: string) => MethodParamAnnotation(new QueryParamAnnotation(paramName))
export const Body = () => MethodParamAnnotation(new BodyAnnotation())
export const Header = (headerName: string) => MethodParamAnnotation(new HeaderAnnotation(headerName))