import { regularExps } from "../../../config";
import { RoleType } from "../../interfaces/types";


export class CreateUserDto {

    private constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role?: RoleType[],        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, CreateUserDto? ] {

        const { name, email, password, role } = object;

        if (!name) return ['Property name is required'];
        if (!email) return ['Property email is required'];
        if (!regularExps.email.test(email)) return ['email is not valid'];
        if (!password) return ['Property password is required'];
        if (password.length < 8) return ['Password must be at least 8 characters'];

        if (role) {
            if (!Array.isArray(role)) return ['Property role must be an array'];
            if (!role.every(r => ['SUPER_ADMIN_ROLE', 'ADMIN_ROLE', 'USER_ROLE'].includes(r))) return ['Invalid role'];
        }    

        return [undefined, new CreateUserDto(name, email, password, role || ['USER_ROLE'])];
    }
}
