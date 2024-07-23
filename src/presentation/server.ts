import express, { Router } from 'express'
import compression from 'compression'
import cors from 'cors';

interface Options {
    port: number,
    routes: Router,
    frontendOrigin: string
}

export class Server {
    private app = express();

    private readonly port: number;
    private readonly routes: Router;
    private readonly frontendOrigin: string;
    
    
    constructor( options: Options) {
        const { port, routes, frontendOrigin } = options;
        this.port = port;
        this.routes = routes;
        this.frontendOrigin = frontendOrigin;
    }

    start() {
        
        //* Middlewares
        this.app.use( express.json() ); // raw
        this.app.use( express.urlencoded({ extended: true })); // x-www-form-urlencoded        
        this.app.use( compression() );

        //* Enable CORS
        this.app.use(cors({
            origin: this.frontendOrigin
        }));        
        
        //* Routes
        this.app.use(this.routes);
                                        
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}