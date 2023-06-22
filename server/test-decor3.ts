import "reflect-metadata"
import {Injectable, IvoryContainer} from "./ivory/container/ivory-container";
import {Annotations} from "./ivory/annotation/annotation";

class RestControllerAnnotation {
    constructor(readonly name: string) {}
}

@Injectable()
class TestClass {

    constructor() {
    }

    sayHello() {
        console.log('hello')
    }
}

@Injectable()
class TestCLass2 {
    constructor(private readonly testClass: TestClass) {
    }

    sayHello() {
        this.testClass.sayHello()
    }
}

Annotations.Class.annotate(
    new RestControllerAnnotation('test'),
    TestClass
)

const container = new IvoryContainer()
container.register(TestClass, TestCLass2)

// console.log(Annotations.Class.first(RestControllerAnnotation, TestClass))
//
const result = container.getBeansByClassAnnotation(RestControllerAnnotation)
console.log(result)
