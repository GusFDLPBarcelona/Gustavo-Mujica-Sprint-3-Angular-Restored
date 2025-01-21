export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    size?: string;  // Mantén esta propiedad si se usa para una talla específica
    sizes?: string[]; // Arreglo de tallas (opcional en caso de que no se use en todos los productos)
    image: string; // Imagen principal del producto
    images?: string[]; // Arreglo de imágenes adicionales
    category: string;
}
