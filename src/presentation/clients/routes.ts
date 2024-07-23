import { Router } from "express";
import { ClientService } from "../services";
import { ClientController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { SharedService } from '../services/shared.service';

export class ClientRoutes {

    static get routes(): Router {
        const router = Router();
        const sharedService = new SharedService();
        const clientService = new ClientService( sharedService );
        const controller = new ClientController( clientService );

        router.get('/',       [ AuthMiddleware.validateAdminToken ], controller.getClients);
        router.get('/:id',    [ AuthMiddleware.validateAdminToken ], controller.getClientById);
        router.post('/',      [ AuthMiddleware.validateAdminToken ], controller.createClient);
        router.put('/:id',    [ AuthMiddleware.validateAdminToken ], controller.updateClient);
        router.delete('/:id', [ AuthMiddleware.validateSuperAdminToken ], controller.deleteClient);

        return router;
    }
}