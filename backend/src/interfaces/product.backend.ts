export interface Product {
  id?: number;
  name: string;
  description: string;
  image: string;
  price: number;
  sizes?: { id: number; size: string; stock: number }[];
  colors?: { id: number; color: string }[];
  images?: string[];
  category?: { id: number; name: string }; // Relación con la tabla `categories`
}
