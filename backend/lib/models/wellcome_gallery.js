"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItem = exports.addGalleryItem = exports.getGalleryImages = void 0;
const firebase_1 = __importDefault(require("../db/firebase"));
const GALLERY_COLLECTION = 'gallery';
// Obtener todas las imágenes de la galería
const getGalleryImages = async () => {
    const snapshot = await firebase_1.default.collection(GALLERY_COLLECTION).get();
    if (snapshot.empty) {
        return [];
    }
    const images = [];
    snapshot.forEach(doc => {
        images.push({ id: doc.id, ...doc.data() });
    });
    return images;
};
exports.getGalleryImages = getGalleryImages;
// Agregar un nuevo elemento a la galería
const addGalleryItem = async (item) => {
    const docRef = await firebase_1.default.collection(GALLERY_COLLECTION).add(item);
    return { id: docRef.id, ...item };
};
exports.addGalleryItem = addGalleryItem;
// Eliminar una imagen de la galería por ID
const deleteGalleryItem = async (id) => {
    await firebase_1.default.collection(GALLERY_COLLECTION).doc(id).delete();
    return { msg: 'Imagen eliminada con éxito' };
};
exports.deleteGalleryItem = deleteGalleryItem;
//# sourceMappingURL=wellcome_gallery.js.map