import {IvoryModule} from "../core/ivory-application";
import {IvoryContainer} from "../core/ivory-container";
import {MongoClient, MongoClientOptions} from "mongodb";

export interface MongoDbModuleConfiguration {
    url: string
    options?: MongoClientOptions
}

export class MongoDbModule implements IvoryModule {
    constructor(private readonly configuration: MongoDbModuleConfiguration) {}

    setup(container: IvoryContainer) {
        const client = new MongoClient(
            this.configuration.url,
            this.configuration.options
        )

        container.registerInstance(client)
    }

    start(container: IvoryContainer) {
        // Nothing to do
    }
}