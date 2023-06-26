import {Body, Get, Post, RestController} from "../ivory/rest/decorators";
import {Session} from "express-session";
import {MySubject} from "./subject";

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
    public async login(session: Session, @Body() command: LoginCommand) {
        if (command.login != 'test' || command.password != 'test') {
            return Promise.resolve({
                error: 'wrong login'
            })
        } else {
            session['subject'] = {
                authenticated: true,
                userId: 1,
                role: 'EXEMPLE'
            }
            return Promise.resolve({
                userId: 1
            })
        }
    }

    @Post('/logout')
    public async logout(session: Session) {
        session.destroy((err) => {
            console.log(err)
        })

        return Promise.resolve({
            logout : "ok"
        })
    }
}