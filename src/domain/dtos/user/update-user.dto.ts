import { regularExps } from "../../../config";
import { RoleType } from "../../interfaces/types";


export class UpdateUserDto {
    
    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly email?: string,
        public readonly password?: string,
        public readonly role?: RoleType[],      
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateUserDto? ] {
        const { id, name, email, password, role } = object;

        if (!id) return ['Property id is required']        
        if (typeof id !== 'string') return ['Property id must be a string'];
        if (id.trim() === '') return ['Property id must be a non-empty string'];
        if (email && !regularExps.email.test(email)) return ['email is not valid'];
        if (password && password.length < 8) return ['Password must be at least 8 characters'];
        if (role) {
            if (!Array.isArray(role)) return ['Property role must be an array'];
            if (!role.every(r => ['SUPER_ADMIN_ROLE', 'ADMIN_ROLE', 'USER_ROLE'].includes(r))) return ['Invalid role'];            
        }

        return [undefined, new UpdateUserDto( id, name, email, password, role )];        
    }
}