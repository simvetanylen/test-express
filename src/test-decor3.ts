import {Injectable, IvoryContainer} from "./ivory/container/ivory-container";



@Injectable()
class MyRepository {

    constructor() {
    }

    public sayHello() {
        console.log('hello')
    }
}


@Injectable()
class MyService {

    private repo: MyRepository


    constructor(repo: MyRepository) {
        this.repo = repo;
    }

    public sayHello() {
        this.repo.sayHello()
        console.log('my hello')
    }
}



const container = new IvoryContainer()

container.register(MyService, MyRepository)
container.getBean(MyService).sayHello()