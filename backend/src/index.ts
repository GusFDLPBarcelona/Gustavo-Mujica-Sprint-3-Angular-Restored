import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './db/connection';

// Importar rutas
import routesProject from './routes/project';
import routesProduct from './routes/product.routes';
import routesGallery from './routes/gallery';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if (!routesGallery || !routesProject || !routesProduct) {
    console.error("ERROR: Alguna de las rutas no está correctamente importada.");
} else {
    console.log('Todas las rutas están correctamente importadas.');
}

// 🔹 Intentar registrar las rutas y capturar errores
try {
    console.log('Registrando rutas en Express...');
    app.use('/api/gallery', routesGallery);
    app.use('/api/projects', routesProject);
    app.use('/api/products', routesProduct);
    console.log('Rutas añadidas correctamente.');
} catch (error) {
    console.error('ERROR al añadir rutas:', error);
}

// 🔹 Listar todas las rutas registradas correctamente
const listRoutes = (app: express.Application) => {
    console.log('Listando rutas registradas en Express...');
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) { 
            console.log(`Ruta registrada: ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === 'router') { 
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    console.log(`Ruta registrada: ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
                }
            });
        }
    });
};

listRoutes(app); //Esto imprimirá todas las rutas correctamente

connection.getConnection()
    .then((conn: any) => { // Agregamos `any` para evitar el error de tipo
        console.log('Conectado a la base de datos');
        conn.release();
    })
    .catch((err: any) => { // También agregamos `any` aquí
        console.error('Error al conectar a la base de datos:', err.message);
    });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
