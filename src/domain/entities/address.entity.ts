import { CustomError } from "../errors/custom.errors";

export class AddressEntity {

    constructor(
        public owner: string, // Owner id
        public ownerModel: string, // Owner model
        public streetAddress: string,
        public city: string,
        public department: string,
        public country: string,
    ) {}

    public static fromObj( object: { [key: string]: any }) {
        const { owner, ownerModel, streetAddress, city, department, country } = object;

        if (!owner) throw CustomError.badRequest("Missing client");
        if (!ownerModel) throw CustomError.badRequest("Missing ownerModel");
        if (!streetAddress) throw CustomError.badRequest("Missing streetAddress");
        if (!city) throw CustomError.badRequest("Missing city");
        if (!department) throw CustomError.badRequest("Missing department");
        if (!country) throw CustomError.badRequest("Missing country");

        return new AddressEntity( owner, ownerModel, streetAddress, city, department, country );
    }
}