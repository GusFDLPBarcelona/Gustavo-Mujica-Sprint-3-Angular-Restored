"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./db/firebase"); // Inicializa la conexión con Firebase
// Importar rutas
const project_1 = __importDefault(require("./routes/project"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const gallery_1 = __importDefault(require("./routes/gallery"));
const app = (0, express_1.default)();
// Usar cors con la configuración recomendada
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Las peticiones que llegan a la función 'api' ya están bajo la ruta /api.
// Express ve el resto de la ruta. Por ejemplo, /api/gallery llega a Express como /gallery.
// Por lo tanto, registramos las rutas sin el prefijo /api.
app.use('/gallery', gallery_1.default);
app.use('/projects', project_1.default);
app.use('/products', product_routes_1.default);
// Exponer la aplicación de Express como una única Cloud Function llamada 'api'
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map