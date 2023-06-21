import {MaxLength, Min} from "class-validator";

export class CreateArticle {

    @MaxLength(5)
    public name: string;

    @MaxLength(500)
    public description?: string;

    @Min(0)
    public price?: number;

    constructor(name: string, description: string, price: number) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}

export class UpdateArticle {

    @MaxLength(5)
    public name: string;

    @MaxLength(500)
    public description?: string;

    @Min(0)
    public price?: number;

    constructor(name: string, description: string, price: number) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}