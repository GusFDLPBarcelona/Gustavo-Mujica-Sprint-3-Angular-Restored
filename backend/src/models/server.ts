import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routesProduct from '../routes/product';
import routesProject from '../routes/project';
import routesGallery from '../routes/gallery';

dotenv.config();

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.listen();
    }

    private middlewares() {
        this.app.use(express.json()); 
        this.app.use(cors({ origin: 'http://localhost:4200', credentials: true })); 
    }

    private routes() {
        console.log('Registrando ruta raíz...');

        this.app.get('/', (req: Request, res: Response) => {
            console.log('Solicitud recibida en /');
            res.json({ msg: 'API Working' });
        });

        this.app.use('/api/products', routesProduct);

        this.app.use('/api/projects', routesProject);

        this.app.use('/api/gallery', routesGallery);
        
    }

    private listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }
}

export default Server;
