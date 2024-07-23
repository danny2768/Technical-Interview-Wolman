import { Address } from "../../interfaces/address.interface";

export class UpdateClientDto {

    private constructor(
        public readonly id: string,
        public readonly documentType?: DocumentType,
        public readonly documentNumber?: string,
        public readonly firstName?: string,
        public readonly firstSurname?: string,
        public readonly birthDate?: Date,        
        public readonly addresses?: Address[],
        public readonly secondName?: string,
        public readonly secondSurname?: string,        
    ) {}

    public static create(object: { [key: string]: any }): [ string?, UpdateClientDto? ] {

        const { id, documentType, documentNumber, firstName, firstSurname, birthDate, addresses, secondName, secondSurname } = object;

        if (!id) return ['Property id is required'];
        if (documentType && !['CC', 'CE', 'TI', 'NIT'].includes(documentType)) return ['Invalid documentType'];
        
        if (birthDate) {    
            const parsedDate = new Date(birthDate);
            if (isNaN(parsedDate.getTime())) return ['Invalid birthDate']; // Checks if parsedDate is an Invalid Date
        }

        if (addresses) {
            // Validate addresses
            if (!Array.isArray(addresses) || addresses.length === 0) return ['Property addresses is required and must be a non-empty array'];
            for (const address of addresses) {
                if (typeof address.streetAddress !== 'string') return ['Property streetAddress in addresses must be a string'];
                if (typeof address.city !== 'string') return ['Property city in addresses must be a string'];
                if (typeof address.department !== 'string') return ['Property department in addresses must be a string'];
                if (typeof address.country !== 'string') return ['Property country in addresses must be a string'];
                if (address.owner && typeof address.owner !== 'string') return ['Property owner in addresses must be a string if provided'];
                if (address.ownerModel && typeof address.ownerModel !== 'string') return ['Property ownerModel in addresses must be a string if provided'];
            }
        }
        
        if (secondName && typeof secondName !== 'string') return ['Property secondName must be a string'];
        if (secondSurname && typeof secondSurname !== 'string') return ['Property secondSurname must be a string'];

        return [undefined, new UpdateClientDto(id, documentType, documentNumber, firstName, firstSurname, birthDate, addresses, secondName, secondSurname)];
    }
}