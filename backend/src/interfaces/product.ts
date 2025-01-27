export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock?: number; // Stock general del producto
    size?: string; // Talla seleccionada
    sizes?: { name: string; stock: number }[]; // Tallas disponibles con stock
    image: string;
    images?: string[];
    category: string;
  }