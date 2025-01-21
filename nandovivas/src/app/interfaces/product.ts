export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock?: number;
    image: string; // Imagen principal del producto
    images?: string[];
    category: string;
    size?: string;
}
