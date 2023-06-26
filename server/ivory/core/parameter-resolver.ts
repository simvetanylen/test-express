
export interface ParameterResolver<INPUT> {
    resolve(input: INPUT): Promise<any>
}

export interface ParameterResolverFactory<INPUT> {
    build(instance: Object, methodName: string | symbol, parameterIndex: number): ParameterResolver<INPUT> | undefined
}

export function createParameterResolver<INPUT>(
    factories: ParameterResolverFactory<INPUT>[],
    instance: Object,
    methodName: string | symbol,
    parameterIndex: number
): ParameterResolver<INPUT> {

    for (let factory of factories) {
        const parameterResolver = factory.build(instance, methodName, parameterIndex)

        if (parameterResolver !== undefined) {
            return parameterResolver
        }
    }

    throw Error(`No parameter resolver for ${instance.constructor.name} ${methodName.toString()} ${parameterIndex}`)
}

export function createMethodParameterResolvers<INPUT>(
    factories: ParameterResolverFactory<INPUT>[],
    instance: Object,
    methodName: string | symbol
): ParameterResolver<INPUT>[] {

    const prototype = Object.getPrototypeOf(instance)
    const parametersLength = prototype[methodName].length

    let resolvers: ParameterResolver<INPUT>[] = []

    for (let paramIndex = 0; paramIndex < parametersLength; paramIndex++) {
        resolvers.push(createParameterResolver(factories, instance, methodName, paramIndex))
    }

    return resolvers
}

export function createParameterResolutionFunction<INPUT>(
    factories: ParameterResolverFactory<INPUT>[],
    instance: Object,
    methodName: string | symbol,
): (input: INPUT) => Promise<any[]> {

    const resolvers = createMethodParameterResolvers(factories, instance, methodName)

    return async function (input: INPUT) {
        let args = []

        for (let resolver of resolvers) {
            const arg = await resolver.resolve(input)
            args.push(arg)
        }

        return args
    }
}
