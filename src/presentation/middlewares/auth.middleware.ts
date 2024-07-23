import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddleware {
    constructor() {}

    private static async extractAndValidateToken(req: Request, expectedRoles: string[] = []) {
        const authorization = req.header('Authorization');
        if (!authorization) throw { status: 401, message: 'Unauthorized. No token provided' };

        if (!authorization.startsWith('Bearer ')) throw { status: 401, message: 'Unauthorized. Invalid Bearer token' };

        const token = authorization.split(' ').at(1) || '';
        const payload = await JwtAdapter.verifyToken<{ id: string, role?: string }>(token);
        if (!payload) throw { status: 401, message: 'Unauthorized. Invalid token' };

        const user = await UserModel.findById(payload.id);
        if (!user) throw { status: 401, message: 'Unauthorized. Invalid token' };

        if (expectedRoles.length && !expectedRoles.some(role => user.role.includes(role))) {
            throw { status: 403, message: 'Forbidden. You dont have permission to access this resource' };
        }

        return user;
    }

    private static async validateTokenWithRole(req: Request, res: Response, next: NextFunction, roles: string[]) {
        try {
            const user = await AuthMiddleware.extractAndValidateToken(req, roles);
            req.body.user = UserEntity.fromObj(user);
            next();
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
            if (error.status === 500 || !error.status) {
                console.log(error);
            }
        }
    }

    static async validateSelfOrAdminToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthMiddleware.extractAndValidateToken(req);
            if (req.params.id === user.id || user.role.includes('ADMIN_ROLE') || user.role.includes('SUPER_ADMIN_ROLE')) {
                req.body.user = UserEntity.fromObj(user);
                next();
            } else {
                throw { status: 403, message: 'Forbidden. You dont have permission to access this resource' };
            }
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
            if (error.status === 500 || !error.status) {
                console.log(error);
            }
        }
    }

    static async validateSelfOrSuperAdminToken(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await AuthMiddleware.extractAndValidateToken(req);
            if (req.params.id === user.id || user.role.includes('SUPER_ADMIN_ROLE')) {
                req.body.user = UserEntity.fromObj(user);
                next();
            } else {
                throw { status: 403, message: 'Forbidden. You dont have permission to access this resource' };
            }
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
            if (error.status === 500 || !error.status) {
                console.log(error);
            }
        }
    }

    static async validateSuperAdminToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['SUPER_ADMIN_ROLE']);
    }

    static async validateAdminToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['ADMIN_ROLE', 'SUPER_ADMIN_ROLE']);
    }

    static async validateUserToken(req: Request, res: Response, next: NextFunction) {
        await AuthMiddleware.validateTokenWithRole(req, res, next, ['USER_ROLE']);
    }    
}