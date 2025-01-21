import { Product } from '../interfaces/product';

export interface ProductDetail extends Product {
  images?: string[]; // Imágenes adicionales del producto
  sizes: string[];  // Tallas disponibles del producto
  quantity?: number; // Cantidad seleccionada por el usuario (opcional)
}