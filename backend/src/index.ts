import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './db/connection';
import routesProducto from './routes/producto';
import routesMarcador from './routes/marcadores';
import routesCalendario from './routes/calendario';
import routesGraficos from './routes/graficos';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', routesProducto);
app.use('/api/marcadores', routesMarcador);
app.use('/api/calendario', routesCalendario);
app.use('/api/graficos', routesGraficos);

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
