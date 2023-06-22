import {IsInt, Min} from "class-validator";

export class AddArticle {

    public articleRef: string

    @Min(0)
    @IsInt()
    public quantity: number

    constructor(articleRef: string, quantity: number) {
        this.articleRef = articleRef;
        this.quantity = quantity;
    }
}

export class RemoveArticle {

    public articleRef: string

    constructor(articleRef: string) {
        this.articleRef = articleRef
    }
}