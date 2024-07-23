import { CustomError } from "../errors/custom.errors";
import { RoleType } from "../interfaces/types";


export class UserEntity {
    
    constructor(
        public id: string,
        public name: string,
        public email: string,        
        public password: string,
        public role: RoleType[],        
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, name, email, password, role, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!name) throw CustomError.badRequest("Missing name");
        if (!email) throw CustomError.badRequest("Missing email");
        if (!password) throw CustomError.badRequest("Missing password");
        if (!role) throw CustomError.badRequest("Missing role");                    

        return new UserEntity( id || _id, name, email, password, role, createdAt, updatedAt, );        
    }
}