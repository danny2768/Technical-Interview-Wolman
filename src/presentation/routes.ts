import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { UsersRoutes } from "./users/routes";
import { ClientRoutes } from "./clients/routes";

export class AppRoutes {

    static get routes(): Router {
        const router = Router();

        router.use('/auth', AuthRoutes.routes );
        router.use('/api/users', UsersRoutes.routes );
        router.use('/api/clients', ClientRoutes.routes );

        return router;
    }
}