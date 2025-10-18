"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const product_routes_1 = __importDefault(require("../routes/product.routes"));
const project_1 = __importDefault(require("../routes/project"));
const gallery_1 = __importDefault(require("../routes/gallery"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '4000';
        this.middlewares();
        this.routes();
        this.listen();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)({ origin: 'http://localhost:4200', credentials: true }));
    }
    routes() {
        console.log('Registrando ruta raíz...');
        this.app.get('/', (req, res) => {
            console.log('Solicitud recibida en /');
            res.json({ msg: 'API Working' });
        });
        this.app.use('/api/products', product_routes_1.default);
        this.app.use('/api/projects', project_1.default);
        this.app.use('/api/gallery', gallery_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map