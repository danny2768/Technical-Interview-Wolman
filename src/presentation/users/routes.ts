import { Router } from "express";
import { UsersController } from "./controller";
import { SharedService, UserService } from "../services";
import { AuthService } from '../services/auth.service';
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class UsersRoutes {
    
    static get routes(): Router {
        const router = Router();    
        const authService = new AuthService();
        const sharedService = new SharedService();
        const userService = new UserService( authService, sharedService );
        const controller = new UsersController( userService );

        router.get("/",       [ AuthMiddleware.validateAdminToken ], controller.getUsers);
        router.get("/:id",    [ AuthMiddleware.validateSelfOrAdminToken ], controller.getUserById);
        router.post("/",      [ AuthMiddleware.validateAdminToken ], controller.createUser);
        router.put("/:id",    [ AuthMiddleware.validateSelfOrAdminToken ], controller.updateUser); 
        router.delete("/:id", [ AuthMiddleware.validateSelfOrSuperAdminToken ], controller.deleteUser);
        
        return router;
    }
}