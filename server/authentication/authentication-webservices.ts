import {Body, Get, Post, RestController} from "../ivory/rest/decorators";
import {Session} from "express-session";
import {MySubject} from "./subject";
import {SessionAuthenticationManager} from "../ivory/rest/session-authentication-manager";

class LoginCommand {
    constructor(
        readonly login: string,
        readonly password: string
    ) {}
}


@RestController('/auth')
export class AuthenticationWebservices {
    @Get('/')
    public async getSubject(subject: MySubject) {
        return Promise.resolve(subject)
    }

    @Post("/login")
    public async login(authManager: SessionAuthenticationManager<MySubject>, @Body() command: LoginCommand) {

        if (command.login != 'test' || command.password != 'test') {
            return Promise.resolve({
                error: 'wrong login'
            })
        } else {
            authManager.login(new MySubject(
                true, [], '1'
            ))

            return Promise.resolve({
                userId: 1
            })
        }
    }

    @Post('/logout')
    public async logout(authManager: SessionAuthenticationManager<MySubject>) {
        authManager.logout()

        return Promise.resolve({
            logout : "ok"
        })
    }
}