import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import './db/firebase'; // Inicializa la conexión con Firebase

// Importar rutas
import routesProject from './routes/project';
import routesProduct from './routes/product.routes';
import routesGallery from './routes/gallery';

const app = express();

// Usar cors con la configuración recomendada
app.use(cors({ origin: true }));
app.use(express.json());

// Las peticiones que llegan a la función 'api' ya están bajo la ruta /api.
// Express ve el resto de la ruta. Por ejemplo, /api/gallery llega a Express como /gallery.
// Por lo tanto, registramos las rutas sin el prefijo /api.
app.use('/gallery', routesGallery);
app.use('/projects', routesProject);
app.use('/products', routesProduct);

// Exponer la aplicación de Express como una única Cloud Function llamada 'api'
export const api = functions.https.onRequest(app);
