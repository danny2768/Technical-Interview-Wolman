import { Request, Response } from "express";
import { CreateClientDto, CustomError, PaginationDto, UpdateClientDto } from "../../domain";
import { ClientService } from "../services";

export class ClientController {
    
    constructor(
        public readonly clientService: ClientService
    ) {}

    private handleError = ( error: unknown, res: Response ) => {
        if (error instanceof CustomError) {
            return res.status( error.statusCode ).json({ error: error.message })
        }
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' })
    };
    
    public getClients = ( req: Request, res: Response ) => {
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if (error) return res.status(400).json({ error });

        this.clientService.getClients( paginationDto! )
            .then( clients => res.json( clients ) )
            .catch( error => this.handleError( error, res ) );
    };
    
    public getClientById = ( req: Request, res: Response ) => {
        this.clientService.getClientById(req.params.id)
            .then( client => res.json( client ) )
            .catch( error => this.handleError( error, res ) );
    };
    
    public createClient = ( req: Request, res: Response ) => {              
        const [ error, createClientDto ] = CreateClientDto.create( req.body );
        if (error) return res.status(400).json({ error });

        this.clientService.createClient( createClientDto! )
            .then( client => res.status(201).json( client ) )
            .catch( error => this.handleError( error, res ) );
    };
    
    public updateClient = ( req: Request, res: Response ) => {
        const id = req.params.id;
        const [ error, updateClientDto ] = UpdateClientDto.create({ ...req.body, id });
        if (error) return res.status(400).json({ error });

        this.clientService.updateClient( updateClientDto! )
            .then( client => res.json( client ) )
            .catch( error => this.handleError( error, res ) );
    };
    
    public deleteClient = ( req: Request, res: Response ) => {
        this.clientService.deleteClient(req.params.id)
            .then( client => res.json( client ) )
            .catch( error => this.handleError( error, res ) );
    };
        
}