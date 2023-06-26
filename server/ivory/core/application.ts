import {IvoryContainer} from "./ivory-container";
import {ClassConstructor} from "class-transformer";

export interface IvoryModule {
    setup(container: IvoryContainer): void
    start(container: IvoryContainer): void
}

export class IvoryApplication {
    private readonly container = new IvoryContainer()
    private modules: IvoryModule[] = []

    public registerModule(module: IvoryModule) {
        this.modules.push(module)
        return this
    }

    public registerBeans(...types: ClassConstructor<any>[]) {
        this.container.registerBeans(...types)
        return this
    }


    public registerInstance(instance: any) {
        this.container.registerInstance(instance)
        return this
    }

    public start() {
        for (let module of this.modules) {
            module.setup(this.container)
        }

        for (let module of this.modules) {
            module.start(this.container)
        }
    }
}