import { AddressModel, ClientModel } from "../../data";
import { AddressEntity, ClientEntity, CustomError, PaginationDto } from "../../domain";
import { SharedService } from "./shared.service";
import { CreateClientDto } from '../../domain/dtos/client/create-client.dto';
import { UpdateClientDto } from '../../domain/dtos/client/update-client.dto';
import { Address } from '../../domain/interfaces/address.interface';

export class ClientService {

    constructor(
        public readonly sharedService: SharedService
    ) {}

    public async getClients(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        try {
            const [total, clients] = await Promise.all([
                ClientModel.countDocuments(),
                ClientModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
            ]);
    
            // Fetch addresses for each client and add to the client object
            const clientObj = await Promise.all(clients.map(async (client) => {
                const addresses = await AddressModel.find({
                    owner: client.id,
                    ownerModel: 'Client'
                });
                
                const addressObj = addresses.map(address => {
                    let addressObj = AddressEntity.fromObj(address);
                    // Remove owner and ownerModel from addressObj
                    const { owner, ownerModel, ...rest } = addressObj;
                    return rest;
                });
                
                return {
                    ...ClientEntity.fromObj(client),
                    addresses: addressObj
                };
            }));
    
            const totalPages = Math.ceil(total / limit);
    
            return {
                pagination: {
                    page: page,
                    limit: limit,
                    totalItems: total,
                    totalPages: totalPages,
                    next: (page < totalPages) ? `/api/clients?page=${page + 1}&limit=${limit}` : null,
                    prev: (page - 1 > 0) ? `/api/clients?page=${page - 1}&limit=${limit}` : null,
                    first: `/api/clients?page=1&limit=${limit}`,
                    last: `/api/clients?page=${totalPages}&limit=${limit}`,
                },
                clients: clientObj
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async getClientById( id: string ) {
        try {
            this.sharedService.validateId( id );
            const client = await ClientModel.findById( id );
            if (!client) throw CustomError.notFound('Client not found');

            const clientObj = ClientEntity.fromObj( client )

            const addresses = await AddressModel.find({
                owner: client.id,
                ownerModel: 'Client'
            });

            const addressObj = addresses.map(address => {
                let addressObj = AddressEntity.fromObj(address);
                // Remove owner and ownerModel from addressObj
                const { owner, ownerModel, ...rest } = addressObj;
                return rest;
            });
            
            return {
                ...clientObj,
                addresses: addressObj
            }
            // TODO: return addresses
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async createClient( createClientDto: CreateClientDto ) {
        const existsClient = await ClientModel.findOne({ documentNumber: createClientDto.documentNumber });
        if (existsClient) throw CustomError.badRequest('Client already exists');

        try {
            const { addresses, ...clientData } = createClientDto;

            const client = new ClientModel( clientData );
            await client.save();

            const clientobj = ClientEntity.fromObj( client );

            let savedAddresses = [];
            // Save addresses
            for (const address of addresses) {
                const addressModel = new AddressModel({
                    ...address,
                    owner: clientobj.id,
                    ownerModel: 'Client'                    
                });
                await addressModel.save();
                let addressObj = AddressEntity.fromObj(addressModel);
                // Remove owner and ownerModel from addressObj
                const { owner, ownerModel, ...rest } = addressObj;
                savedAddresses.push(rest);
            }

            return {
                message: 'Client created successfully',
                client: {
                    ...clientobj,
                    addresses: savedAddresses
                }
            }            
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async updateClient(updateClientDto: UpdateClientDto) {
        const { id, addresses, ...updateOptions } = updateClientDto;
        this.sharedService.validateId(id);
        try {
            const client = await ClientModel.findByIdAndUpdate({ _id: id }, updateOptions, { new: true });
            if (!client) throw CustomError.notFound(`Client with id ${id} not found`);
            
            const clientObj = ClientEntity.fromObj(client);
    
            // Delete existing addresses if addresses are provided
            if (addresses) {
                await AddressModel.deleteMany({ owner: id, ownerModel: 'Client' });
    
                let savedAddresses = [];
                // Save new addresses
                for (const address of addresses) {
                    const addressModel = new AddressModel({
                        ...address,
                        owner: client.id,
                        ownerModel: 'Client'
                    });
                    await addressModel.save();
                    let addressObj = AddressEntity.fromObj(addressModel);
                    // Remove owner and ownerModel from addressObj
                    const { owner, ownerModel, ...rest } = addressObj;
                    savedAddresses.push(rest);
                }
    
                // Return updated client with new addresses
                return {
                    message: 'Client updated successfully',
                    client: {
                        ...clientObj,
                        addresses: savedAddresses
                    }
                };
            } else {
                // Return updated client without modifying addresses
                return {
                    message: 'Client updated successfully',
                    client: clientObj
                };
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async deleteClient(id: string) {
        try {
            this.sharedService.validateId(id);
    
            // Check if the client has any associated addresses
            const addresses = await AddressModel.find({ owner: id, ownerModel: 'Client' });
            if (addresses.length > 0) {
                // Delete associated addresses
                await AddressModel.deleteMany({ owner: id, ownerModel: 'Client' });
            }
    
            // Delete the client
            const client = await ClientModel.findByIdAndDelete(id);
            if (!client) throw CustomError.notFound(`Client with id ${id} not found`);
            
            return { 
                message: `Client with id ${id} and their associated addresses have been deleted`,
                client: ClientEntity.fromObj(client)
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }
}