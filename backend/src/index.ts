import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './db/connection';
import routesProject from '../src/routes/project';
import routesProduct from './routes/product';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/projects', routesProject);
app.use('/api/products', routesProduct);

connection.getConnection()
    .then(conn => {
        console.log('Conectado a la base de datos');
        conn.release();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
