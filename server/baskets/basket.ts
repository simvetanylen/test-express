
export class Basket {
    id: string
    content: {
        articleRef: string
        quantity: number
    }[]

    constructor(id: string, content: { articleRef: string; quantity: number }[]) {
        this.id = id;
        this.content = content;
    }
}