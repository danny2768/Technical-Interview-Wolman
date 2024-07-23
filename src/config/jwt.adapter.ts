import jwt from 'jsonwebtoken'
import { envs } from './envs'


export class JwtAdapter {
    
    public static async generateToken( payload: any, duration: string = '2h' ): Promise<string | null> {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SECRET, { expiresIn: duration }, (err, token) => {
                if ( err ) return resolve(null)
                return resolve(token!)
            });
        })
    };

    public static verifyToken<T>(token: string):  Promise<T | null> {
        return new Promise( (resolve) => {
            jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
                if ( err ) return resolve(null)
                return resolve(decoded as T)
            });
        })
    }
}