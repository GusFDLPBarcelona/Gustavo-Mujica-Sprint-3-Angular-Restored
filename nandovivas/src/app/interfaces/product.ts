export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    size?: string;
    sizes?: { name: string; stock: number }[]; // Tallas con su stock
    image: string;
    images?: string[];
    category: string;
  }