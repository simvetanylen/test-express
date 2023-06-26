import {UnauthenticatedException, UnauthorizedException} from "./exceptions";

export abstract class AbstractSubject {
    readonly authenticated: boolean
    readonly permissions: string[]

    protected constructor(authenticated: boolean, permissions: string[]) {
        this.authenticated = authenticated;
        this.permissions = permissions;
    }

    assertIsAuthenticated() {
        if (!this.authenticated) {
            throw new UnauthenticatedException()
        }
    }

    assertHasAllPermissions(...permissions: string[]) {
        for (let permission of permissions) {
            if (this.permissions.indexOf(permission) === -1) {
                throw new UnauthorizedException()
            }
        }
    }

    assertHasOneOfPermissions(...permissions: string[]) {
        for (let permission of permissions) {
            if (this.permissions.indexOf(permission) !== -1) {
                return
            }
        }

        throw new UnauthorizedException()
    }
}