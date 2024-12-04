import express, { Application, Request, Response } from 'express';
import routesProducto from '../routes/producto';
import routesMarcador from '../routes/marcadores';
import routesGraficos from '../routes/graficos';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

class Server {

    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '4000';
        this.listen();
        this.midlewares();
        this.routes();
    }

    midlewares() {

        this.app.use(express.json());
        this.app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
    }

    routes() {

        this.app.get('/', (req: Request, res: Response) => {
            res.json({ msg: 'API Working' });
        });


        this.app.use('/api/productos', routesProducto);
        this.app.use('/api/marcadores', routesMarcador);
        this.app.use('/api/graficos', routesGraficos);
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`);
        });
    }
}

export default Server;