import { CustomError } from "../errors/custom.errors";

export class ClientEntity {

    constructor(
        public id: string,
        public documentType: string,
        public documentNumber: string,
        public firstName: string,
        public firstSurname: string,
        public birthDate: Date,        
        public secondName?: string,
        public secondSurname?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { id, _id, documentType, documentNumber, firstName, firstSurname, birthDate, secondName, secondSurname, createdAt, updatedAt, } = object;

        if (!id && !_id) throw CustomError.badRequest("Missing id");
        if (!documentType) throw CustomError.badRequest("Missing documentType");
        if (!documentNumber) throw CustomError.badRequest("Missing documentNumber");
        if (!firstName) throw CustomError.badRequest("Missing firstName");
        if (!firstSurname) throw CustomError.badRequest("Missing firstSurname");
        if (!birthDate) throw CustomError.badRequest("Missing birthDate");                

        return new ClientEntity( id || _id, documentType, documentNumber, firstName, firstSurname, birthDate, secondName, secondSurname, createdAt, updatedAt, );
    }
}