import { Product } from '../interfaces/product';

export interface ProductDetail extends Product {
  images?: string[]; // Imágenes adicionales del producto
  sizes?: { name: string; stock: number }[]; // Tallas disponibles del producto
  quantity?: number; // Cantidad seleccionada por el usuario (opcional)
}