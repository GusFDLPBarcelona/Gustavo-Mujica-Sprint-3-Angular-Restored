"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_1 = require("../controllers/gallery");
const router = (0, express_1.Router)();
// Ruta corregida para que `/api/gallery` devuelva una respuesta válida
router.get('/', async (req, res) => {
    console.log('Solicitud GET recibida en /api/gallery');
    await (0, gallery_1.getAllGalleryImages)(req, res);
});
// Ruta para agregar una imagen a la galería
router.post('/', (req, res) => {
    console.log('Solicitud POST recibida en /api/gallery');
    (0, gallery_1.addGalleryItemController)(req, res);
});
// Ruta para eliminar una imagen de la galería por ID
router.delete('/:id', (req, res) => {
    console.log(`Solicitud DELETE recibida en /api/gallery con ID: ${req.params.id}`);
    (0, gallery_1.deleteGalleryItemController)(req, res);
});
// Respuesta de prueba para asegurarnos de que la API funciona
router.get('/test', (req, res) => {
    res.json({ message: "API Gallery funcionando correctamente" });
});
exports.default = router;
//# sourceMappingURL=gallery.js.map