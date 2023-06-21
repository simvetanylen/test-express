import {VersionedDocument} from "../ivory/orm/optimistic-repository";

export class Article extends VersionedDocument {
    name: string
    description?: string
    price?: number

    constructor(name: string, description: string, price: number) {
        super();
        this.name = name;
        this.description = description;
        this.price = price;
    }
}